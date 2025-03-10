<?php

namespace App\Entity;

use App\Repository\TypeReleveRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: TypeReleveRepository::class)]
class TypeReleve
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['defaultReleve', 'defaultTypeReleve'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['defaultReleve', 'defaultTypeReleve'])]
    private ?string $nom = null;

    #[ORM\ManyToOne(inversedBy: 'typeReleves')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['defaultReleve', 'defaultTypeReleve'])]
    private ?Societe $societe = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getSociete(): ?Societe
    {
        return $this->societe;
    }

    public function setSociete(?Societe $societe): static
    {
        $this->societe = $societe;

        return $this;
}
}
