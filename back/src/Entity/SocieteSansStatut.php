<?php

namespace App\Entity;

use App\Repository\SocieteSansStatutRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SocieteSansStatutRepository::class)]
class SocieteSansStatut
{

    #[ORM\Id]
    #[ORM\ManyToOne(inversedBy: 'statutsExclus')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Societe $societe = null;

    #[ORM\Id]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?StatutAction $statut = null;

    public function getSociete(): ?Societe
    {
        return $this->societe;
    }

    public function setSociete(?Societe $societe): static
    {
        $this->societe = $societe;

        return $this;
    }

    public function getStatut(): ?StatutAction
    {
        return $this->statut;
    }

    public function setStatut(?StatutAction $statut): static
    {
        $this->statut = $statut;

        return $this;
    }
}
