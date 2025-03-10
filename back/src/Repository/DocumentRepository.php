<?php

namespace App\Repository;

use App\Entity\Document;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class DocumentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Document::class);
    }

    public function create(Document $document): void
    {
        $entityManager = $this->getEntityManager();
        $entityManager->persist($document);
        $entityManager->flush();
    }

    public function update(Document $document): void
    {
        $entityManager = $this->getEntityManager();
        $entityManager->flush(); // Doctrine gère l'update automatiquement
    }

    public function delete(Document $document): void
    {
        $entityManager = $this->getEntityManager();
        $entityManager->remove($document);
        $entityManager->flush();
    }

    // Ajoutez d'autres méthodes de recherche ou de filtrage si nécessaire
}