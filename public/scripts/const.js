export const tiles = {
    x: 32,
    y: 18,
    size: (window.innerHeight - 100) / 18
}

export const screenSize = {
    width: tiles.size * 32, 
    height: tiles.size * 18 
}

export const playerVelocity = 400;
// export const playerVelocity = 900;

export const playerBulletSpeed = 1000;

export const gravityPower = 2000;

export const distancesForBulletTravel = {
    playerBullet: 10
};