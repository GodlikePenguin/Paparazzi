import SetQueue from "./SetQueue"

describe("SetQueue", () => {
    let setQueue: SetQueue<string>

    beforeEach(() => {
        setQueue = new SetQueue();
    })

    describe("push()", () => {
        test("should add a new item an increase the queue length", () => {
            expect(setQueue.size()).toEqual(0);
            setQueue.push("test");
            expect(setQueue.size()).toEqual(1);
        })

        test("should not error when duplicate items are added, but the size should not increase", () => {
            setQueue.push("test");
            expect(setQueue.size()).toEqual(1);
            setQueue.push("test");
            expect(setQueue.size()).toEqual(1);
        })
    })
    describe("pop()", () => {
        test("should throw an error when the queue is empty", () => {
            expect(() => setQueue.pop()).toThrow();
        })

        test("should return the first item in the queue when non empty", () => {
            setQueue.push("first");
            setQueue.push("second");
            expect(setQueue.pop()).toEqual("first");
        })
    })

    describe("peek()", () => {
        test("should throw an error when the queue is empty", () => {
            expect(() => setQueue.peek()).toThrow();
        })

        test("should not modify the state of the queue when called", () => {
            setQueue.push("first");
            const previousRemaining = setQueue.remaining();
            const response = setQueue.peek();
            expect(response).toEqual("first");
            expect(setQueue.remaining()).toEqual(previousRemaining);
        })
    })

    describe("size()", () => {
        test("should return 0 when the queue is empty", () => {
            expect(setQueue.size()).toEqual(0);
        })

        test("should increase as items are added to the queue", () => {
            expect(setQueue.size()).toEqual(0);
            setQueue.push("one");
            expect(setQueue.size()).toEqual(1);
            setQueue.push("two")
            expect(setQueue.size()).toEqual(2);
        })

        test("should remain the same even after items are removed", () => {
            expect(setQueue.size()).toEqual(0);
            setQueue.push("one");
            expect(setQueue.size()).toEqual(1);
            setQueue.push("two")
            expect(setQueue.size()).toEqual(2);
            setQueue.pop();
            expect(setQueue.size()).toEqual(2);
            setQueue.pop();
            expect(setQueue.size()).toEqual(2);
        })
    })

    describe("empty()", () => {
        test("should return true for a new queue", () => {
            expect(setQueue.empty()).toEqual(true);
        })

        test("should return false for a queue with active items", () => {
            setQueue.push("first");
            expect(setQueue.empty()).toEqual(false);
        })

        test("should return true for a queue where all items have been popped", () => {
            setQueue.push("first");
            setQueue.pop();
            expect(setQueue.empty()).toEqual(true);
        })
    })

    describe("remaining()", () => {
        test("should return 0 when the queue is empty", () => {
            expect(setQueue.remaining()).toEqual(0);
        })

        test("should increase as items are added to the queue", () => {
            expect(setQueue.remaining()).toEqual(0);
            setQueue.push("one");
            expect(setQueue.remaining()).toEqual(1);
            setQueue.push("two")
            expect(setQueue.remaining()).toEqual(2);
        })

        test("should decrease after items are removed", () => {
            expect(setQueue.remaining()).toEqual(0);
            setQueue.push("one");
            expect(setQueue.remaining()).toEqual(1);
            setQueue.push("two")
            expect(setQueue.remaining()).toEqual(2);
            setQueue.pop();
            expect(setQueue.remaining()).toEqual(1);
            setQueue.pop();
            expect(setQueue.remaining()).toEqual(0);
        })
    })
})
