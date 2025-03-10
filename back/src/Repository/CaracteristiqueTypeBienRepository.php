<?php

namespace App\Repository;

use App\Entity\CaracteristiqueTypeBien;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<CaracteristiqueTypeBien>
 */
class CaracteristiqueTypeBienRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CaracteristiqueTypeBien::class);
    }

    public function create(CaracteristiqueTypeBien $caracteristiqueTypeBien): void
    {
        $this->getEntityManager()->persist($caracteristiqueTypeBien);
        $this->getEntityManager()->flush();
    }

    public function delete(CaracteristiqueTypeBien $caracteristiqueTypeBien): void
    {
        $this->getEntityManager()->remove($caracteristiqueTypeBien);
        $this->getEntityManager()->flush();
    }

    public function update(): void
    {
        $this->getEntityManager()->flush();
    }

    public function findByTypeBienId(int $typeBienId)
    {
        return $this->createQueryBuilder('ctb')
            ->andWhere('ctb.typeBien = :typeBienId')
            ->setParameter('typeBienId', $typeBienId)
            ->getQuery()
            ->getResult();
    }

    public function findOneBy(array $criteria, array $orderBy = null): ?CaracteristiqueTypeBien
    {
        return $this->createQueryBuilder('ctb')
            ->andWhere('ctb.typeBien = :typeBien')
            ->andWhere('ctb.caracteristique = :caracteristique')
            ->setParameter('typeBien', $criteria['typeBien'])
            ->setParameter('caracteristique', $criteria['caracteristique'])
            ->getQuery()
            ->getOneOrNullResult();
    }

    // Vous pouvez ajouter d'autres méthodes personnalisées ici si nécessaire
    public function deleteByTypeBienId(TypeBien $typeBien): void
    {
        $entityManager = $this->getEntityManager();
    
        // Récupérer toutes les caractéristiques associées à typeBienId
        $caracteristiques = $this->createQueryBuilder('ctb')
            ->innerJoin('ctb.typeBien', 'tb')
            ->where('tb.id = :typeBienId')
            ->setParameter('typeBienId', $typeBienId)
            ->getQuery()
            ->getResult();
    
        foreach ($caracteristiques as $caracteristique) {
            $entityManager->remove($caracteristique);
        }
    
        $entityManager->flush();
    }
}