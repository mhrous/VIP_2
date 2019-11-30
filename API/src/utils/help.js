export const getFirstOfThisMonth = (
  m = new Date().getMonth(),
  y = new Date().getFullYear()
) => new Date(y, parseInt(m), 1, 0, 0, 0, 0);

export const getFirstOfNextMonth = (
  m = new Date().getMonth(),
  y = new Date().getFullYear()
) => new Date(y, parseInt(m) + 1, 1, 0, 0, 0, 0);

export const randomPassword = () => {
  let str = "";
  for (let i = 0; i < 8; i++) {
    str += Math.floor(Math.random() * 9);
  }
  return str;
};
