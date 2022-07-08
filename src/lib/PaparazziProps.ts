import { Flags } from "@oclif/core";
import { FlagBase } from "@oclif/core/lib/interfaces";

export const FLAGS = {
    output: Flags.string({
        char: "o",
        description: "Output location",
        default: "./images"
    }),
    width: Flags.integer({
        char: "w",
        description: "Width of the output images",
        default: 1920
    }),
    height: Flags.integer({
        char: "h",
        description: "Height of the output images",
        default: 1080
    }),
    scale: Flags.integer({
        char: "s",
        description: "Scale factor for the rendered website",
        default: 1
    }),
    delay: Flags.integer({
        char: "d",
        description: "Number of ms to wait before taking the screenshot on each page",
        default: 0
    }),
    "user-agent": Flags.string({
        description: "User Agent to spoof whilst making HTTP requests"
    }),
    device: Flags.string({
        description: "Emulate this device when making HTTP requests"
    }),
    "list-devices": Flags.boolean({
        description: "List all devices which can be emulated and exit (Note this is a long list)",
        default: false
    }),
    "full-page": Flags.boolean({
        description: "Ensure all content on page is included in screenshot (will override width and height settings)",
        default: false
    }),
    "allow-all-hosts": Flags.boolean({
        description: "Take screenshots of any HTTP host, not just those specified",
        default: false
    })
}

// Absolutely disgusting type magic to unwrap the flags above
type UnwrapObject<T> = {
    [P in keyof T]: Unwrap<T[P]>
}

type Unwrap<T> = T extends FlagBase<infer U, never> ?
    U extends object ? UnwrapObject<U> : U :
    T extends object ? UnwrapObject<T> : T

export type PaparazziProps = Unwrap<typeof FLAGS>;
