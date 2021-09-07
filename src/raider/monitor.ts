const MonitorTimeout = 10 * 1000;  // 10s

class ScanMonitor {
  private fetchStatus: () => Promise<string>;

  constructor(fetchStatus: () => Promise<string>) {
    this.fetchStatus = fetchStatus;
  }

  start(onSuccess: () => Promise<void>, onError: (err) => void) {
    const that = this;

    setTimeout(() => {
      that.fetchStatus()
        .then(status => {
          if (status === 'complete') {
            onSuccess()
              .then(() => {})
              .catch(() => {});
          } else if (status === 'waiting') {
            that.start(onSuccess, onError);
          } else {
            onError(new Error(`unknown scan status: ${status}`));
          }
        })
        .catch(err => {
          onError(err);
        });
    }, MonitorTimeout);
  }
}

export default ScanMonitor;
