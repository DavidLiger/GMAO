<?php

namespace App\EventListener;

use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\DBAL\Schema\SchemaException;
use Doctrine\ORM\Tools\Event\GenerateSchemaTableEventArgs;
use Doctrine\ORM\Tools\ToolEvents;

#[AsDoctrineListener(event: ToolEvents::postGenerateSchemaTable, connection: 'default')]
final class ToolEventsListener
{

    public const PREG_IGNORE = '/^oauth2_.+/';

    /**
     * Note : Cet event doit être ignorer lors de la création des tables "oauth2_" dans le cas où
     * le schéma de la base est entièrement créé via doctrine.
     * Il faut également commenter une ligne dans le fichier du module "Doctrine" :
     * "vendor/doctrine/dbal/src/Schema/Schema.php".
     *
     * Commenter la ligne où l'exception est lancée (en principe ligne 117) :
     * throw SchemaException::tableAlreadyExists($tableName);
     *
     * <b>Il reste préférable d'importer la structure via mysql en production.</b>
     *
     * @param GenerateSchemaTableEventArgs $eventArgs
     * @see \Doctrine\DBAL\Schema\Schema::_addTable()
     */
    public function postGenerateSchemaTable(GenerateSchemaTableEventArgs $eventArgs): void
    {
        $schema = $eventArgs->getSchema();

        try {
            foreach ($schema->getTables() as $table) {
                if (preg_match(self::PREG_IGNORE, $table->getName())) {
                    $schema->dropTable($table->getName());
                }
            }
        } catch (SchemaException $e) {
            error_log($e->getMessage());
        }
    }
}