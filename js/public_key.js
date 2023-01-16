const key = {
    map: "0123456789.",
    public: "978W56Z3X4120A",
    encode: (k) => key.public[key.map.indexOf(k)],
    decode: (k) => key.map[key.public.indexOf(k)],
    apply: (map, call) => key.correct(map).split("").map((k) => call(k)).join(""),
    validate: (map) => key.correct(map).split("").filter((k) => !key.public.includes(k)).length == 0,
    correct: (map) => map.split("").map((k) => k.toUpperCase()).join("")
};

exports.key = key;