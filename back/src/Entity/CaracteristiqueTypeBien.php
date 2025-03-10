<?php

namespace App\Entity;

use App\Repository\CaracteristiqueTypeBienRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: CaracteristiqueTypeBienRepository::class)]
class CaracteristiqueTypeBien
{
    #[ORM\Id]
    #[ORM\ManyToOne(inversedBy: 'caracteristiqueTypeBiens')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['default', 'defaultCaracteristiqueTypeBien'])]
    private ?Caracteristique $caracteristique = null;

    #[ORM\Id]
    #[ORM\ManyToOne(inversedBy: 'caracteristiqueTypeBiens')]
    #[ORM\JoinColumn(nullable: false)]
    private ?TypeBien $typeBien = null;

    #[ORM\Column]
    #[Groups(['default', 'defaultCaracteristiqueTypeBien'])]
    private ?int $priorite = null;

    public function getPriorite(): ?int
    {
        return $this->priorite;
    }

    public function setPriorite(int $priorite): static
    {
        $this->priorite = $priorite;

        return $this;
    }

    public function getCaracteristique(): ?Caracteristique
    {
        return $this->caracteristique;
    }

    public function setCaracteristique(?Caracteristique $caracteristique): static
    {
        $this->caracteristique = $caracteristique;

        return $this;
    }

    public function getTypeBien(): ?TypeBien
    {
        return $this->typeBien;
    }

    public function setTypeBien(?TypeBien $typeBien): static
    {
        $this->typeBien = $typeBien;

        return $this;
    }
}
