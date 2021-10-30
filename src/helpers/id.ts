const ID_CHARACTEER_SET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";

export function generateRandomId(): string {
  // const length: number = 5 + Math.floor(Math.random() * 4)
  // let id = ""

  // for (let i = 0; i < length; i++)
  // {
  //   id = id + ID_CHARACTEER_SET[Math.floor(Math.random() * ID_CHARACTEER_SET.length)]
  // }
  // return id;

  return new Array(5 + Math.floor(Math.random() * 4))
    .map(
      () =>
        ID_CHARACTEER_SET[Math.floor(Math.random() * ID_CHARACTEER_SET.length)]
    )
    .join("");
}

export function validateCustomId(id: string): boolean {
  for (let i = 0; i < id.length; i++) {
    if (!ID_CHARACTEER_SET.includes(id[i])) {
      return false;
    }
  }

  return true;
}

export function validateIdCharacters(candidateId: string): boolean {
  return candidateId
    .split("")
    .every((char) => ID_CHARACTEER_SET.includes(char));
}
