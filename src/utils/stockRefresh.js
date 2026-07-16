const listeners = new Set();

export const emitStockRefresh = () => {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (error) {
      console.error("Error in stock refresh listener:", error);
    }
  });
};

export const subscribeStockRefresh = (listener) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};
