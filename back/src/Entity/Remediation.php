<?php

namespace App\Entity;

use App\Repository\RemediationRepository; // Assurez-vous de créer ce repository
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: RemediationRepository::class)]
class Remediation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['default', 'defaultRemediation'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['default', 'defaultRemediation'])]
    private ?string $nom = null;

    #[ORM\ManyToOne(inversedBy: 'remediations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['default', 'defaultRemediation'])]
    private ?Societe $societe = null;

    /**
     * @var Collection<int, Action>
     */
    #[ORM\OneToMany(mappedBy: 'remediation', targetEntity: Action::class)]
    private Collection $actions;

    public function __construct()
    {
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

    public function getSociete(): ?Societe
    {
        return $this->societe;
    }

    public function setSociete(?Societe $societe): static
    {
        $this->societe = $societe;

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
            $action->setRemediation($this); // Assurez-vous que la méthode setRemediation existe dans Action
        }

        return $this;
    }

    public function removeAction(Action $action): static
    {
        if ($this->actions->removeElement($action)) {
            // set the owning side to null (unless already changed)
            if ($action->getRemediation() === $this) {
                $action->setRemediation(null); // Assurez-vous que la méthode setRemediation existe dans Action
            }
        }

        return $this;
    }
}