<?php

namespace App\Entity;

use App\Repository\ComposantRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: ComposantRepository::class)]
class Composant extends Bien
{
    #[Groups(['defaultComposant'])]
    #[ORM\ManyToOne(inversedBy: 'composants')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Equipement $equipement = null;

    public function getEquipement(): ?Equipement
    {
        return $this->equipement;
    }

    public function setEquipement(?Equipement $equipement): static
    {
        $this->equipement = $equipement;

        return $this;
    }

    public function getBreadcrumbs(): array
    {
        return array_merge(
            [
                ['nom' => $this->getEquipement()->getSite()->getNom(), 'id' => $this->getEquipement()->getSite()->getId()],
                ['nom' => $this->getEquipement()->getOuvrage()->getNom(), 'id' => $this->getEquipement()->getOuvrage()->getId()],
                ['nom' => $this->getEquipement()->getNom(), 'id' => $this->getEquipement()->getId()]
            ],
            parent::getBreadcrumbs()
        );
    }
}
