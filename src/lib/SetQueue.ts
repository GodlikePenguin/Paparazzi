export default class SetQueue<T> {
  private queue: Array<T> = [];
  private index = 0;

  push(item: T): void {
    if (!this.queue.includes(item)) {
      this.queue.push(item);
    }
  }

  pop(): T {
    const item = this.peek();

    this.index++;
    return item;
  }

  peek(): T {
    if (this.index < this.queue.length) {
      return this.queue[this.index];
    }
    throw new Error("Cannot peek empty queue");

  }

  empty(): boolean {
    return this.queue.length <= this.index;
  }

  size(): number {
    return this.queue.length - this.index;
  }
}
