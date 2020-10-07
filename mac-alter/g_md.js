#!/usr/bin/env node

const path = require("path");
const fs = require("fs");

const keyRules = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./capslock.json"), "utf-8")
).rules;
// const keyRules = JSON.parse(
//   fs.readFileSync(path.resolve(__dirname, "./ultimate_macOS.json"), "utf-8")
// ).rules;

console.log(keyRules.map((rule) => rule.description));

const formatFrom = (from) => {
  const { key_code, modifiers } = from;
  const { mandatory } = modifiers;
  let mandatoryStr = "";
  if (mandatory) {
    mandatoryStr = mandatory
      .join()
      .replace("right_command,right_control,right_shift,right_option", "");
  }
  return {
    from: key_code,
    ...modifiers,
    mandatory: mandatoryStr,
  };
};

const formatTo = (to) => {
  const { key_code, modifiers } = to;
  delete to.key_code;
  const modifiersStr = modifiers
    ? modifiers
        .join()
        .replace("right_command,right_control,right_shift,right_option", "")
    : "";
  return { to: key_code, ...to, modifiers: modifiersStr };
};

// console.table(navigation);
console.table(
  keyRules
    .map((rule) => {
      return rule.manipulators.map((m) => {
        const from = formatFrom(m.from);
        const to = formatTo(m.to[0]);
        return {
          ...from,
          ...to,
        };
      });
    })
    .flat()
);
