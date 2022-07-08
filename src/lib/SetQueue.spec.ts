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
})
