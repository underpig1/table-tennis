export const key = {
    map: "0123456789.",
    public: "ABCDEFGHJ",
    encode: (k) => this.public[this.map.indexOf(k)],
    decode: (k) => this.map[this.public.indexOf(k)],
    kmap: (map, call) => map.split("").map((k) => call(k)).join("")
};