<?php

namespace App\Entity;

use App\Repository\BienRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\InheritanceType('JOINED')]
#[ORM\DiscriminatorColumn(name: 'nature', type: 'string')]
#[ORM\DiscriminatorMap(['site' => Site::class, 'ouvrage' => Ouvrage::class, 'equipement' => Equipement::class, 'composant' => Composant::class])]
#[ORM\Entity(repositoryClass: BienRepository::class)]
abstract class Bien
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['defaultBien', 'defaultSite', 'defaultComposant', 'defaultOuvrage', 'defaultEquipement', 'minimal', 'defaultReleve'])]
    protected ?int $id = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['defaultBien', 'defaultSite', 'defaultComposant', 'defaultOuvrage', 'defaultEquipement', 'minimal', 'defaultReleve'])]
    protected ?string $nom = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['defaultBien', 'minimal'])]
    protected ?string $image = null;

    #[Groups(['defaultBien', 'defaultSite', 'defaultComposant', 'defaultOuvrage', 'defaultEquipement', 'minimal'])]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    protected ?string $description = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    protected ?Societe $societe = null;

    #[ORM\ManyToOne(inversedBy: 'biens')]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['defaultBien', 'minimal'])]
    protected ?TypeBien $typeBien = null;

    /**
     * @var Collection<int, BienCaracteristique>
     */
    #[ORM\OneToMany(targetEntity: BienCaracteristique::class, mappedBy: 'bien')]
    protected Collection $caracteristiques;

    /**
     * @var Collection<int, EtiquetteBien>
     */
    #[ORM\OneToMany(targetEntity: EtiquetteBien::class, mappedBy: 'bien')]
    protected Collection $etiquetteBiens;

    /**
     * @var Collection<int, Action>
     */
    #[ORM\OneToMany(targetEntity: Action::class, mappedBy: 'bien')]
    protected Collection $actions;

    public function __construct()
    {
        $this->caracteristiques = new ArrayCollection();
        $this->etiquetteBiens = new ArrayCollection();
        $this->actions = new ArrayCollection();
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

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): static
    {
        $this->image = $image;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getsociete(): ?Societe
    {
        return $this->societe;
    }

    public function setsociete(?Societe $societe): static
    {
        $this->societe = $societe;

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

    /**
     * @return Collection<int, BienCaracteristique>
     */
    public function getCaracteristiques(): Collection
    {
        return $this->caracteristiques;
    }

    public function addCaracteristique(BienCaracteristique $caracteristique): static
    {
        if (!$this->caracteristiques->contains($caracteristique)) {
            $this->caracteristiques->add($caracteristique);
            $caracteristique->setBien($this);
        }

        return $this;
    }

    public function removeCaracteristique(BienCaracteristique $caracteristique): static
    {
        if ($this->caracteristiques->removeElement($caracteristique)) {
            // set the owning side to null (unless already changed)
            if ($caracteristique->getBien() === $this) {
                $caracteristique->setBien(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, EtiquetteBien>
     */
    public function getEtiquetteBiens(): Collection
    {
        return $this->etiquetteBiens;
    }

    public function addEtiquetteBien(EtiquetteBien $etiquetteBien): static
    {
        if (!$this->etiquetteBiens->contains($etiquetteBien)) {
            $this->etiquetteBiens->add($etiquetteBien);
            $etiquetteBien->setBien($this);
        }

        return $this;
    }

    public function removeEtiquetteBien(EtiquetteBien $etiquetteBien): static
    {
        if ($this->etiquetteBiens->removeElement($etiquetteBien)) {
            // set the owning side to null (unless already changed)
            if ($etiquetteBien->getBien() === $this) {
                $etiquetteBien->setBien(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Action>
     */
    public function getActions(): Collection
    {
        return $this->actions;
    }

    public function addAction(Action $action): static
    {
        if (!$this->actions->contains($action)) {
            $this->actions->add($action);
            $action->setBien($this);
        }

        return $this;
    }

    public function removeAction(Action $action): static
    {
        if ($this->actions->removeElement($action)) {
            // set the owning side to null (unless already changed)
            if ($action->getBien() === $this) {
                $action->setBien(null);
            }
        }

        return $this;
    }

    public function getBreadcrumbs(): array
    {
        return [];
    }

    public function getChildren(): ?Collection
    {
        return null;
    }
}
