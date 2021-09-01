import type { StreamDetails } from './stream';

class Playlist {
  private list: StreamDetails[] = [];
  private currentlyPlaying: StreamDetails | null = null;

  constructor(initialState?: StreamDetails[]) {
    const playlist = this;

    if (initialState) {
      initialState.forEach(stream => {
        playlist.add(stream);
      });
    }
  }

  isEmpty(): boolean {
    return this.list.length === 0;
  }

  current(): StreamDetails | null {
    return this.currentlyPlaying;
  }

  next(): StreamDetails | null {
    if (this.isEmpty()) {
      this.currentlyPlaying = null;
      return null;
    }

    const stream = this.list[0];
    this.list = this.list.splice(1);
    this.currentlyPlaying = stream;

    return stream;
  }

  add(stream: StreamDetails) {
    this.list.push(stream);
  }

  titles(): string[] {
    const l = this.currentlyPlaying ? [this.currentlyPlaying] : [];
    return [...l, ...this.list].map(stream => stream.title);
  }
}

export default Playlist;
