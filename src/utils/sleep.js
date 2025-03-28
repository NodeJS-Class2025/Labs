const sleep = (ms) => {
  return new Promise((res, rej) => {
    setTimeout(() => res(), ms);
  });
};

export default sleep;
