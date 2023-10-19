export const tiles = {
    x: 32,
    y: 18,
    size: (window.innerHeight - 100) / 18
}

export const screenSize = {
    width: tiles.size * 32, 
    height: tiles.size * 18 
}

const gravityPower = 2000