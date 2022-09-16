import thanksSecurityABI from "../abis/ThanksSecurity.json";
import thanksPayDataABI from "../abis/ThanksData.json";
import thanksPayMainABI from "../abis/ThanksPayMain.json";
import thanksPayRelayABI from "../abis/ThanksPayRelay.json";
import thanksPayCheckABI from "../abis/ThanksPayCheck.json";

import * as fs from "fs";

const typeTranslate = (type: string) => {
  //check if type has prefix "uint":
  if (type.startsWith("uint")) {
    //check if it ends with []
    if (type.endsWith("[]")) {
      return "number[]";
    } else {
      return "number";
    }
  }
  if (type.startsWith("bool")) {
    if (type.endsWith("[]")) {
      return "boolean[]";
    } else {
      return "boolean";
    }
  }
  if (type.startsWith("address")) {
    if (type.endsWith("[]")) {
      return "string[]";
    } else {
      return "string";
    }
  }
  if (type.startsWith("bytes")) {
    if (type.endsWith("[]")) {
      return "string[]";
    } else {
      return "string";
    }
  }
  return type;
};

const merge = (obj1: any, obj2: any) => {
  for (let i = 0; i < obj1.inputTypes.length; ++i) {
    let name1 = obj1.inputNames[i];
    let match: boolean = false;
    for (let j = 0; j < obj2.inputNames.length; ++j) {
      let name2 = obj2.inputNames[j];
      //check if string name1 is in string name2 or name2 is in name1
      if (name1.includes(name2) || name2.includes(name1)) {
        match = true;
        break;
      }
    }
    if (!match) {
      // add to obj2
      obj2.inputNames.push(name1 + "?");
      obj2.inputTypes.push(obj1.inputTypes[i]);
    }
  }
  return obj2;
};

const getSchema = (abi: any) => {
  // filter abi where "type" is "function"
  const functions = abi.filter((row: any) => row["type"] === "function");

  // make an array where key is functions['name']
  const arrayOfFunctions = functions.map((func: any) => {
    //func["name"] = func["name"].charAt(0).toUpperCase() + func["name"].slice(1);
    return {
      name: func["name"].charAt(0).toUpperCase() + func["name"].slice(1),
      inputTypes: func["inputs"].map((input: any) => input["type"]),
      inputNames: func["inputs"].map((input: any) => input["name"]),
    };
  });
  for (let i = 0; i < arrayOfFunctions.length; i++) {
    while (
      i + 1 < arrayOfFunctions.length &&
      arrayOfFunctions[i].name === arrayOfFunctions[i + 1].name
    ) {
      arrayOfFunctions[i] = merge(arrayOfFunctions[i], arrayOfFunctions[i + 1]);
      arrayOfFunctions.splice(i, 1);
      i--;
    }
  }

  for (let i = 0; i < arrayOfFunctions.length; i++)
  if(arrayOfFunctions[i].inputNames.length) {
    for(let j = 0; j < arrayOfFunctions[i].inputNames.length; j++){
      while(
        j < arrayOfFunctions[i].inputNames.length &&
        arrayOfFunctions[i].inputNames[j] === ""
      ) {
        arrayOfFunctions[i].inputNames.splice(j, 1);
        arrayOfFunctions[i].inputTypes.splice(j, 1);
        j --;
      }
    }
  }
  return arrayOfFunctions;
};

async function createFileIfNotThere(fileName: string) {
  fs.promises.readdir(__dirname + "/generatedTypes").catch(() => {
    fs.mkdirSync(__dirname + "/generatedTypes");
  });
  fs.promises
    .readFile(__dirname + "/generatedTypes/" + fileName + ".ts")
    .catch(() => {
      fs.writeFileSync(__dirname + "/generatedTypes/" + fileName + ".ts", "");
      console.log(`just made ${fileName}.ts`);
    });
}

async function generateTyping(fileName: string, schema: any) {
  let typing = "";
  for (let i = 0; i < schema.length; i++) {
    const func = schema[i];
    const funcName = func.name;
    const inputTypes = func.inputTypes;
    const inputNames = func.inputNames;
    typing += `type ${funcName}Type = {`;
    for (let j = 0; j < inputTypes.length; j++) {
      const inputType = inputTypes[j];
      const inputName = inputNames[j];
      typing += `
  ${inputName}: ${typeTranslate(inputType)},`;
    }
    typing += `
}
`;
  }
  //console.log(typing);
  typing += `
export type ${fileName} = {`
  for (let i = 0; i < schema.length; i++) {
    const func = schema[i];
    const funcName = func.name;
    typing += `
  ${funcName.charAt(0).toLowerCase() + funcName.slice(1)}: ${funcName}Type,`;
  }
  typing += `
}`
  fs.writeFileSync(__dirname + "/generatedTypes/" + fileName + ".ts", typing);
}

async function main() {
  const thanksPaySecuritySchema = getSchema(thanksSecurityABI);
  const thanksPayDataSchema = getSchema(thanksPayDataABI);
  const thanksPayMainSchema = getSchema(thanksPayMainABI);
  const thanksPayRelaySchema = getSchema(thanksPayRelayABI);
  const thanksPayCheckSchema = getSchema(thanksPayCheckABI);
  await createFileIfNotThere("ThanksPaySecurityTypes");
  await createFileIfNotThere("ThanksPayDataTypes");
  await createFileIfNotThere("ThanksPayMainTypes");
  await createFileIfNotThere("ThanksPayRelayTypes");
  await createFileIfNotThere("ThanksPayCheckTypes");
  await createFileIfNotThere("ThanksPaySuperType");
  await generateTyping("ThanksPaySecurityTypes", thanksPaySecuritySchema);
  await generateTyping("ThanksPayDataTypes", thanksPayDataSchema);
  await generateTyping("ThanksPayMainTypes", thanksPayMainSchema);
  await generateTyping("ThanksPayRelayTypes", thanksPayRelaySchema);
  await generateTyping("ThanksPayCheckTypes", thanksPayCheckSchema);

  let superType = `
import { ThanksPaySecurityTypes } from "./ThanksPaySecurityTypes";
import { ThanksPayDataTypes } from "./ThanksPayDataTypes";
import { ThanksPayMainTypes } from "./ThanksPayMainTypes";
import { ThanksPayRelayTypes } from "./ThanksPayRelayTypes";
import { ThanksPayCheckTypes } from "./ThanksPayCheckTypes";

export type ThanksPaySuperType = {
  thanksPaySecurity: ThanksPaySecurityTypes,
  thanksPayData: ThanksPayDataTypes,
  thanksPayMain: ThanksPayMainTypes,
  thanksPayRelay: ThanksPayRelayTypes,
  thanksPayCheck: ThanksPayCheckTypes,
};`;
  fs.writeFileSync(__dirname + "/generatedTypes/ThanksPaySuperType.ts", superType);

}

main().then(() => {
  console.log("");
});
