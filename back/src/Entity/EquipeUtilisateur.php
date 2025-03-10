<?php

namespace App\Entity;

use App\Repository\EquipeUtilisateurRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: EquipeUtilisateurRepository::class)]
class EquipeUtilisateur
{
    #[ORM\Id]
    #[ORM\ManyToOne(inversedBy: 'equipeUtilisateurs')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['UtilisateurAll'])]
    private ?Equipe $equipe = null;

    #[ORM\Id]
    #[ORM\ManyToOne(inversedBy: 'equipeUtilisateurs')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['EquipeMembre'])]
    private ?Utilisateur $utilisateur = null;

    #[ORM\Column]
    #[Groups(['EquipeMembre'])]
    private ?bool $responsable = null;


    public function isResponsable(): ?bool
    {
        return $this->responsable;
    }

    public function setResponsable(bool $responsable): static
    {
        $this->responsable = $responsable;

        return $this;
    }

    public function getEquipe(): ?Equipe
    {
        return $this->equipe;
    }

    public function setEquipe(?Equipe $equipe): static
    {
        $this->equipe = $equipe;

        return $this;
    }

    public function getUtilisateur(): ?Utilisateur
    {
        return $this->utilisateur;
    }

    public function setUtilisateur(?Utilisateur $utilisateur): static
    {
        $this->utilisateur = $utilisateur;

        return $this;
    }
}
