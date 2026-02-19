export const COLS = 10;
export const ROWS = 21;
export const HIDDEN_ROWS = 1;

export const LINES_PER_LEVEL = 5; //usually 10 but that's slow

export const BLOCK_SIZE = 30;

export const FPS_60_MS = 1000 / 60;

export const GRAVITY = { //Like TGM but not, it's worse and weird, oh and do have fun
    0: 4,
    30: 6,
    35: 8,
    40: 10,
    50: 12,
    60: 16,
    70: 32,
    80: 48,
    90: 64,
    100: 80,
    120: 96,
    140: 112,
    160: 128,
    170: 144,
    200: 4,
    220: 32,
    230: 64,
    233: 96,
    236: 128,
    239: 160,
    243: 192,
    247: 224,
    251: 256, //1G
    300: 512, //2G
    330: 768, //3G
    360: 1024, //4G
    400: 1280, //5G
    420: 1536, //6G
    450: 1792, //7G,
    470: 2048, //8G
    490: 2304, //9G
    500: 2560, //10G
    520: 2816, //11G
    550: 3072, //12G
    580: 3328, //13G
    600: 3584, //14G
    620: 3840, //15G
    650: 4096, //16G
    680: 4352, //17G
    700: 4608, //18G
    750: 4864, //19G
    800: 5120, //20G
}; //level:gravity, gravity is in units of 1/256 G (where 1 G is one row per frame in 60 fps)

export const COLORS = {
    CYAN: '#00ffff',
    YELLOW: '#ffff00',
    VIOLET: '#aa00ff',
    GREEN: '#00ff00',
    RED: '#ff0000',
    BLUE: '#0000ff',
    ORANGE: '#ff8800',
    BLACK: '#000',
    WHITE: '#fff',

    PURPLE: '#800080'
};
