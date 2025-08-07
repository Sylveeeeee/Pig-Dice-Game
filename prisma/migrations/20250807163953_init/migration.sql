-- CreateTable
CREATE TABLE `Player` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Player_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Game` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `player1Id` INTEGER NOT NULL,
    `player2Id` INTEGER NOT NULL,
    `winnerId` INTEGER NULL,
    `player1Score` INTEGER NOT NULL,
    `player2Score` INTEGER NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `rollsOf1P1` INTEGER NOT NULL DEFAULT 0,
    `rollsOf1P2` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlayerStatistics` (
    `playerId` INTEGER NOT NULL,
    `totalGames` INTEGER NOT NULL DEFAULT 0,
    `wins` INTEGER NOT NULL DEFAULT 0,
    `losses` INTEGER NOT NULL DEFAULT 0,
    `winPercentage` DOUBLE NOT NULL DEFAULT 0,
    `avgScorePerGame` DOUBLE NOT NULL DEFAULT 0,
    `maxScore` INTEGER NOT NULL DEFAULT 0,
    `avgGameDuration` DOUBLE NOT NULL DEFAULT 0,
    `totalRollsOf1` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`playerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Game` ADD CONSTRAINT `Game_player1Id_fkey` FOREIGN KEY (`player1Id`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Game` ADD CONSTRAINT `Game_player2Id_fkey` FOREIGN KEY (`player2Id`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Game` ADD CONSTRAINT `Game_winnerId_fkey` FOREIGN KEY (`winnerId`) REFERENCES `Player`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlayerStatistics` ADD CONSTRAINT `PlayerStatistics_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
