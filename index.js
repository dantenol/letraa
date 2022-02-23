"use strict";
let chosen = "";
let currentWord = "";
let line = 1;

const lean = (word) => {
  return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const $ = (selector) => {
  const element = document.querySelectorAll(selector);
  if (element.length === 1) {
    return element[0];
  } else {
    return element;
  }
};

const $letter = (letter) => {
  const opts = $(".key");
  let key;
  opts.forEach((opt) => {
    console.log(opt.innerHTML);
    if (opt.innerHTML === letter) {
      key = opt;
    }
  });
  console.log(letter, key);
  return key;
};

const dialog = {
  el: $(".dialog"),
  show: async (text) => {
    dialog.el.innerHTML = "";
    dialog.el.innerHTML = text;
    dialog.el.classList.add("show");
    await sleep(2000);
    dialog.el.classList.remove("show");
  },
  success: async (text) => {
    dialog.el.innerHTML = "";
    dialog.el.innerHTML = text;
    dialog.el.classList.add("success");
    await sleep(2000);
    dialog.el.classList.remove("success");
  },
};

const chooseWord = () => {
  const range = escolhas.length;
  const random = Math.floor(Math.random() * range);
  return escolhas[random];
};

window.onload = () => {
  chosen = chooseWord();
  $(".line-1 > .letter:first-child").classList.add("active");
  console.log(chosen);
  $(".key:not(.left)").forEach((letter) => {
    letter.addEventListener("click", (event) => {
      event.target.blur();
      const letter = event.target.innerHTML;
      addLetter(letter);
    });
  });
  $(".key.left").forEach((letter) => {
    letter.addEventListener("click", (event) => {
      event.target.blur();
      const letter = event.target.innerHTML;
      if (letter === "del") {
        removeLetter();
      } else {
        checkWord();
      }
    });
  });
};

const addLetter = (letter) => {
  if (currentWord.length >= 5) {
    return;
  }
  currentWord += letter;
  const current = $(`.active`);
  current.classList.remove("active");
  current.innerText = letter;
  if (currentWord.length === 5) {
    checkWord();
  } else {
    $(
      `.line-${line}> .letter:nth-child(${currentWord.length + 1})`
    ).classList.add("active");
  }
};

const removeLetter = () => {
  currentWord = currentWord.slice(0, -1);
  const current = $(`.active`);
  const previous =
    $(`.line-${line}> .letter:nth-child(${currentWord.length + 1})`) ||
    $(`.line-${line}> .letter:last-child`);
  current.classList?.remove("active");
  previous.classList.add("active");
  previous.innerText = "";
};

document.addEventListener("keydown", (event) => {
  if (event.key.match(/^[a-z]$/)) {
    addLetter(event.key);
  } else if (event.key === "Backspace") {
    removeLetter();
  } else if (event.key === "Enter") {
    checkWord();
  }
});

const validateWord = (word) => {
  if (opcoes.has(word) || escolhas.includes(word)) {
    return word;
  }
  if (opcoesAcento[word]) {
    return opcoesAcento[word];
  }
  return false;
};

const checkWord = async () => {
  const word = currentWord.toLowerCase();
  if (word.length < 5) {
    dialog.show("Palavra muito curta!");
    return;
  }
  const isValid = validateWord(word);
  if (!isValid) {
    dialog.show("Palavra inválida!");
    return;
  } else {
    isValid.split("").forEach((letter, i) => {
      const curLet = lean(letter);
      const plainChosen = lean(chosen);
      const el = $(`.line-${line} > .letter:nth-child(${i + 1})`);
      if (curLet !== el.innerText) {
        el.innerText = letter;
      }
      if (curLet === plainChosen[i]) {
        el.classList.add("pos");
        $letter(curLet).classList.add("pos");
      } else if (plainChosen.includes(curLet)) {
        el.classList.add("ltr");
        $letter(curLet).classList.add("ltr");
      } else {
        el.classList.add("wrong");
        $letter(curLet).classList.add("wrong");
      }
    });
  }

  if (isValid === chosen) {
    dialog.show("Parabéns! Você acertou!");
    return;
  }
  if (line < 6) {
    line++;
    currentWord = "";
    await sleep(200);
    $(`.line-${line} .letter:first-child`).classList.add("active");
  }
};
