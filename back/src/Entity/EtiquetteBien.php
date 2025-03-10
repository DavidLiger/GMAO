<?php

namespace App\Entity;

use App\Repository\EtiquetteBienRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EtiquetteBienRepository::class)]
class EtiquetteBien
{

    #[ORM\Id]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Etiquette $etiquette = null;

    #[ORM\Id]
    #[ORM\ManyToOne(inversedBy: 'etiquetteBiens')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Bien $bien = null;

    public function getEtiquette(): ?Etiquette
    {
        return $this->etiquette;
    }

    public function setEtiquette(?Etiquette $etiquette): static
    {
        $this->etiquette = $etiquette;

        return $this;
    }

    public function getBien(): ?Bien
    {
        return $this->bien;
    }

    public function setBien(?Bien $bien): static
    {
        $this->bien = $bien;

        return $this;
    }
}
