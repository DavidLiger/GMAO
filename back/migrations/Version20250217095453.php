<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250217095453 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE type_action CHANGE societe_id societe_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE type_action ADD CONSTRAINT FK_641BE7AAFCF77503 FOREIGN KEY (societe_id) REFERENCES societe (id)');
        $this->addSql('CREATE INDEX IDX_641BE7AAFCF77503 ON type_action (societe_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE type_action DROP FOREIGN KEY FK_641BE7AAFCF77503');
        $this->addSql('DROP INDEX IDX_641BE7AAFCF77503 ON type_action');
        $this->addSql('ALTER TABLE type_action CHANGE societe_id societe_id INT NOT NULL');
    }
}
