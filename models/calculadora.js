function somar(...args) {
  if (args.some((value) => typeof value !== "number")) {
    return "Erro";
  }
  return args.reduce((acc, value) => acc + value, 0);
}

exports.somar = somar;
