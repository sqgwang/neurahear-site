const OptimizationArchive = (() => {
  let connection;
  function open() {
    if (!connection) connection = new Promise((resolve, reject) => {
      const request = indexedDB.open('neurahear-digit-optimization', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('rounds', { keyPath: 'id' });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => { connection = null; reject(request.error); };
      request.onblocked = () => { connection = null; reject(new Error('Local archive is blocked by another tab.')); };
    });
    return connection;
  }
  async function transaction(mode, operation) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('rounds', mode);
      const request = operation(tx.objectStore('rounds'));
      tx.oncomplete = () => resolve(request.result);
      tx.onerror = () => reject(tx.error || request.error);
      tx.onabort = () => reject(tx.error || new Error('Local archive write aborted.'));
    });
  }
  return {
    put: record => transaction('readwrite', store => store.put(record)),
    get: id => transaction('readonly', store => store.get(id)),
    list: () => transaction('readonly', store => store.getAll()),
    remove: id => transaction('readwrite', store => store.delete(id)),
  };
})();
