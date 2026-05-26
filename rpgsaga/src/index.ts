import { HeroFactory } from './factory/HeroFactory';
import { GameEngine } from './game/GameEngine';

function main() {
    console.log('Добро пожаловать в Akvelon RPG SAGA!');

    const playerCount = 4;
    
    try {
        const heroes = HeroFactory.createHeroesArray(playerCount);
        console.log('\nСозданные герои:');
        heroes.forEach(hero => {
            console.log(`${hero.toString()} | Здоровье: ${hero.health} | Сила: ${hero.strength}`);
        });
        
        const game = new GameEngine(heroes);
        const winner = game.start();
        
        console.log(`\nЧемпион: ${winner?.toString()}`);
    } catch (error) {
        console.error(error);
    }
}

main();