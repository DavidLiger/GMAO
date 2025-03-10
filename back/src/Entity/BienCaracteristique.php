<?php

namespace App\Entity;

use App\Repository\BienCaracteristiqueRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: BienCaracteristiqueRepository::class)]
class BienCaracteristique
{

    #[ORM\Id]
    #[ORM\ManyToOne(inversedBy: 'caracteristiques')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Bien $bien = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['bienCarac'])]
    private ?string $valeur = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['bienCarac'])]
    private ?int $priorite = null;

    #[ORM\Id]
    #[ORM\ManyToOne(inversedBy: 'bienCaracteristiques')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['bienCarac'])]
    private ?Caracteristique $caracteristique = null;

    public function getBien(): ?Bien
    {
        return $this->bien;
    }

    public function setBien(?Bien $bien): static
    {
        $this->bien = $bien;

        return $this;
    }

    public function getValeur(): ?string
    {
        return $this->valeur;
    }

    public function setValeur(?string $valeur): static
    {
        $this->valeur = $valeur;

        return $this;
    }

    public function getPriorite(): ?int
    {
        return $this->priorite;
    }

    public function setPriorite(?int $priorite): static
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
}
