<?php

namespace App\Entity;

use App\Repository\FonctionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FonctionRepository::class)]
class Fonction
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nom = null;

    /**
     * @var Collection<int, Utilisateur>
     */
    #[ORM\ManyToMany(targetEntity: Utilisateur::class, inversedBy: 'fonctions')]
    private Collection $utilisateurs;

    /**
     * @var Collection<int, EquipeUtilisateur>
     */
    #[ORM\OneToMany(targetEntity: EquipeUtilisateur::class, mappedBy: 'fonction')]
    private Collection $equipeUtilisateur;

    public function __construct()
    {
        $this->utilisateurs = new ArrayCollection();
        $this->equipeUtilisateur = new ArrayCollection();
    }

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

    /**
     * @return Collection<int, Utilisateur>
     */
    public function getUtilisateurs(): Collection
    {
        return $this->utilisateurs;
    }

    public function addUtilisateur(Utilisateur $utilisateur): static
    {
        if (!$this->utilisateurs->contains($utilisateur)) {
            $this->utilisateurs->add($utilisateur);
        }

        return $this;
    }

    public function removeUtilisateur(Utilisateur $utilisateur): static
    {
        $this->utilisateurs->removeElement($utilisateur);

        return $this;
    }

    /**
     * @return Collection<int, EquipeUtilisateur>
     */
    public function getEquipeUtilisateur(): Collection
    {
        return $this->equipeUtilisateur;
    }

    public function addEquipeUtilisateur(EquipeUtilisateur $equipeUtilisateur): static
    {
        if (!$this->equipeUtilisateur->contains($equipeUtilisateur)) {
            $this->equipeUtilisateur->add($equipeUtilisateur);
            $equipeUtilisateur->setFonction($this);
        }

        return $this;
    }

    public function removeEquipeUtilisateur(EquipeUtilisateur $equipeUtilisateur): static
    {
        if ($this->equipeUtilisateur->removeElement($equipeUtilisateur)) {
            // set the owning side to null (unless already changed)
            if ($equipeUtilisateur->getFonction() === $this) {
                $equipeUtilisateur->setFonction(null);
            }
        }

        return $this;
    }
}
