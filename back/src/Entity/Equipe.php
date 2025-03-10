<?php

namespace App\Entity;

use App\Repository\EquipeRepository;
use DateTimeInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: EquipeRepository::class)]
class Equipe
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['defaultEquipe', 'EquipeMembre', 'UtilisateurAll'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['defaultEquipe', 'EquipeMembre', 'UtilisateurAll'])]
    private ?string $nom = null;

    #[ORM\Column(length: 255)]
    #[Groups(['defaultEquipe', 'EquipeMembre'])]
    private ?string $libelle = null;

    #[ORM\ManyToOne(inversedBy: 'equipes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Societe $societe = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?DateTimeInterface $dateDerniereModif = null;

    /**
     * @var Collection<int, ActionUtilisateur>
     */
    #[ORM\OneToMany(targetEntity: ActionUtilisateur::class, mappedBy: 'equipe')]
    private Collection $actionUtilisateurs;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['defaultEquipe', 'EquipeMembre', 'UtilisateurAll'])]
    private ?string $color = null;

    /**
     * @var Collection<int, EquipeUtilisateur>
     */
    #[ORM\OneToMany(targetEntity: EquipeUtilisateur::class, mappedBy: 'equipe', orphanRemoval: true)]
    #[Groups(['EquipeMembre'])]
    private Collection $equipeUtilisateurs;

    public function __construct()
    {
        $this->actionUtilisateurs = new ArrayCollection();
        $this->equipeUtilisateurs = new ArrayCollection();
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

    public function getLibelle(): ?string
    {
        return $this->libelle;
    }

    public function setLibelle(string $libelle): static
    {
        $this->libelle = $libelle;

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

    public function getDateDerniereModif(): ?DateTimeInterface
    {
        return $this->dateDerniereModif;
    }

    public function setDateDerniereModif(?DateTimeInterface $dateDerniereModif): static
    {
        $this->dateDerniereModif = $dateDerniereModif;

        return $this;
    }

    /**
     * @return Collection<int, ActionUtilisateur>
     */
    public function getActionUtilisateurs(): Collection
    {
        return $this->actionUtilisateurs;
    }

    public function addActionUtilisateur(ActionUtilisateur $actionUtilisateur): static
    {
        if (!$this->actionUtilisateurs->contains($actionUtilisateur)) {
            $this->actionUtilisateurs->add($actionUtilisateur);
            $actionUtilisateur->setEquipe($this);
        }

        return $this;
    }

    public function removeActionUtilisateur(ActionUtilisateur $actionUtilisateur): static
    {
        if ($this->actionUtilisateurs->removeElement($actionUtilisateur)) {
            // set the owning side to null (unless already changed)
            if ($actionUtilisateur->getEquipe() === $this) {
                $actionUtilisateur->setEquipe(null);
            }
        }

        return $this;
    }

    public function getColor(): ?string
    {
        return $this->color;
    }

    public function setColor(?string $color): static
    {
        $this->color = $color;

        return $this;
    }

    /**
     * @return Collection<int, EquipeUtilisateur>
     */
    public function getEquipeUtilisateurs(): Collection
    {
        return $this->equipeUtilisateurs;
    }

    public function addEquipeUtilisateur(EquipeUtilisateur $equipeUtilisateur): static
    {
        if (!$this->equipeUtilisateurs->contains($equipeUtilisateur)) {
            $this->equipeUtilisateurs->add($equipeUtilisateur);
            $equipeUtilisateur->setEquipe($this);
        }

        return $this;
    }

    public function removeEquipeUtilisateur(EquipeUtilisateur $equipeUtilisateur): static
    {
        if ($this->equipeUtilisateurs->removeElement($equipeUtilisateur)) {
            // set the owning side to null (unless already changed)
            if ($equipeUtilisateur->getEquipe() === $this) {
                $equipeUtilisateur->setEquipe(null);
            }
        }

        return $this;
    }
}
