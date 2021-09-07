const MonitorTimeout = 10 * 1000;  // 10s

class ScanMonitor {
  private fetchStatus: () => Promise<string>;

  constructor(fetchStatus: () => Promise<string>) {
    this.fetchStatus = fetchStatus;
  }

  waitForEnd(): Promise<void> {
    const that = this;

    return new Promise((resolve, reject) => {
      that.scheduleStatusCheck(resolve, reject);
    });
  }

  private scheduleStatusCheck(resolve: () => void, reject: (err) => void) {
    const that = this;

    setTimeout(async () => {
      try {
        const status = await that.fetchStatus();

        if (status === 'complete') {
          resolve();
        } else if (status === 'waiting') {
          that.scheduleStatusCheck(resolve, reject);
        } else if (status === 'failed') {
          reject(new Error('scan failed'));
        } else {
          reject(new Error(`unknown scan status: ${status}`));
        }
      } catch (err) {
        reject(err);
      }
    }, MonitorTimeout);
  }
}

export default ScanMonitor;
