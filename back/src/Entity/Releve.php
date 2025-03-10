<?php

namespace App\Entity;

use App\Repository\ReleveRepository;
use DateTimeInterface;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: ReleveRepository::class)]
class Releve
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups('defaultReleve')]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'releves')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups('defaultReleve')]
    private ?Equipement $equipement = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups('defaultReleve')]
    private ?string $valeur = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups('defaultReleve')]
    private ?DateTimeInterface $date = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups('defaultReleve')]
    private ?TypeReleve $typeReleve = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEquipement(): ?Equipement
    {
        return $this->equipement;
    }

    public function setEquipement(?Equipement $equipement): static
    {
        $this->equipement = $equipement;

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

    public function getDate(): ?DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(?DateTimeInterface $date): static
    {
        $this->date = $date;

        return $this;
    }

    public function getTypeReleve(): ?TypeReleve
    {
        return $this->typeReleve;
    }

    public function setTypeReleve(?TypeReleve $typeReleve): static
    {
        $this->typeReleve = $typeReleve;

        return $this;
    }
}
