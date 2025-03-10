<?php

namespace App\Entity;

use App\Repository\TypeActionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: TypeActionRepository::class)]
class TypeAction
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['default', 'defaultTypeAction'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['default', 'defaultTypeAction'])]
    private ?string $nom = null;

    #[ORM\ManyToOne(inversedBy: 'sousTypes')]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['default', 'defaultTypeAction'])]
    private ?TypeAction $typeActionParent = null;

    #[ORM\ManyToOne(inversedBy: 'typeActions')]
    #[ORM\JoinColumn(nullable: false)] // Changez à true si vous voulez que ce soit optionnel
    #[Groups(['default', 'defaultTypeAction'])]
    private ?Societe $societe = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['default', 'defaultTypeAction'])]
    private ?string $color = null;

    /**
     * @var Collection<int, Action>
     */
    #[ORM\OneToMany(mappedBy: 'typeAction', targetEntity: Action::class)]
    private Collection $actions;

    /**
     * @var Collection<int, TypeAction>
     */
    #[ORM\OneToMany(mappedBy: 'typeActionParent', targetEntity: TypeAction::class)]
    private Collection $sousTypes;

    public function __construct()
    {
        $this->actions = new ArrayCollection();
        $this->sousTypes = new ArrayCollection();
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

    public function getSociete(): ?Societe
    {
        return $this->societe;
    }

    public function setSociete(?Societe $societe): static
    {
        $this->societe = $societe;

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

    public function getTypeActionParent(): ?TypeAction
    {
        return $this->typeActionParent;
    }

    public function setTypeActionParent(?TypeAction $typeActionParent): static
    {
        $this->typeActionParent = $typeActionParent;

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
            $action->setTypeAction($this);
        }

        return $this;
    }

    public function removeAction(Action $action): static
    {
        if ($this->actions->removeElement($action)) {
            // set the owning side to null (unless already changed)
            if ($action->getTypeAction() === $this) {
                $action->setTypeAction(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, TypeAction>
     */
    public function getSousTypes(): Collection
    {
        return $this->sousTypes;
    }

    public function addSousType(TypeAction $sousType): static
    {
        if (!$this->sousTypes->contains($sousType)) {
            $this->sousTypes->add($sousType);
            $sousType->setTypeActionParent($this);
        }

        return $this;
    }

    public function removeSousType(TypeAction $sousType): static
    {
        if ($this->sousTypes->removeElement($sousType)) {
            // set the owning side to null (unless already changed)
            if ($sousType->getTypeActionParent() === $this) {
                $sousType->setTypeActionParent(null);
            }
        }

        return $this;
    }
}
