<?php

namespace App\Entity;

use App\Repository\LocPointMesureTypeBienRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: LocPointMesureTypeBienRepository::class)]
class LocPointMesureTypeBien
{

    #[ORM\Id]
    #[ORM\ManyToOne(inversedBy: 'locPointMesureTypeBiens')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['defaultPointMesureTypeBien'])]
    private ?TypeBien $typeBien = null;

    #[ORM\Id]
    #[ORM\ManyToOne(inversedBy: 'locPointMesureTypeBiens')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['defaultPointMesureTypeBien'])]
    private ?LocPointMesure $locPointMesure = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $valeurDefaut = null;


    public function getTypeBien(): ?TypeBien
    {
        return $this->typeBien;
    }

    public function setTypeBien(?TypeBien $typeBien): static
    {
        $this->typeBien = $typeBien;

        return $this;
    }

    public function getLocPointMesure(): ?LocPointMesure
    {
        return $this->locPointMesure;
    }

    public function setLocPointMesure(?LocPointMesure $locPointMesure): static
    {
        $this->locPointMesure = $locPointMesure;

        return $this;
    }

    public function getValeurDefaut(): ?string
    {
        return $this->valeurDefaut;
    }

    public function setValeurDefaut(?string $valeurDefaut): static
    {
        $this->valeurDefaut = $valeurDefaut;

        return $this;
    }
}
