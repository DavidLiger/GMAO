<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250217104607 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // Vérifiez si la colonne existe déjà
        if (!$schema->getTable('type_releve')->hasColumn('societe_id')) {
            $this->addSql('ALTER TABLE type_releve ADD societe_id INT NOT NULL');
            $this->addSql('ALTER TABLE type_releve ADD CONSTRAINT FK_FE7C94BBFCF77503 FOREIGN KEY (societe_id) REFERENCES societe (id)');
            $this->addSql('CREATE INDEX IDX_FE7C94BBFCF77503 ON type_releve (societe_id)');
        }
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE type_releve DROP FOREIGN KEY FK_FE7C94BBFCF77503');
        $this->addSql('DROP INDEX IDX_FE7C94BBFCF77503 ON type_releve');
        $this->addSql('ALTER TABLE type_releve DROP societe_id');
    }
}
