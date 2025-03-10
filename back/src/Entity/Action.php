<?php

namespace App\Entity;

use App\Repository\ActionRepository;
use DateTimeInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: ActionRepository::class)]
class Action
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nom = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\ManyToOne(inversedBy: 'actions')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['defaultTypeAction'])]
    private ?TypeAction $typeAction = null;

    #[ORM\ManyToOne(inversedBy: 'actions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Bien $bien = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?DateTimeInterface $dateInterTheorique = null;

    #[ORM\Column(nullable: true)]
    private ?int $dureeTotale = null;

    #[ORM\Column(nullable: true)]
    private ?float $cout = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?DateTimeInterface $dateCreation = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?DateTimeInterface $dateDerniereModif = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?DateTimeInterface $dateCloture = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?StatutAction $statut = null;

    #[ORM\ManyToOne(inversedBy: 'actions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Cause $cause = null;

    #[ORM\ManyToOne(inversedBy: 'actions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Criticite $criticite = null;

    #[ORM\ManyToOne(inversedBy: 'actions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Remediation $remediation = null;

    /**
     * @var Collection<int, ActionTache>
     */
    #[ORM\OneToMany(targetEntity: ActionTache::class, mappedBy: 'Action')]
    private Collection $taches;

    /**
     * @var Collection<int, ActionUtilisateur>
     */
    #[ORM\OneToMany(targetEntity: ActionUtilisateur::class, mappedBy: 'Action')]
    private Collection $utilisateurs;

    public function __construct()
    {
        $this->taches = new ArrayCollection();
        $this->utilisateurs = new ArrayCollection();
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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getTypeAction(): ?TypeAction
    {
        return $this->typeAction;
    }

    public function setTypeAction(?TypeAction $typeAction): static
    {
        $this->typeAction = $typeAction;

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

    public function getDateInterTheorique(): ?DateTimeInterface
    {
        return $this->dateInterTheorique;
    }

    public function setDateInterTheorique(?DateTimeInterface $dateInterTheorique): static
    {
        $this->dateInterTheorique = $dateInterTheorique;

        return $this;
    }

    public function getDureeTotale(): ?int
    {
        return $this->dureeTotale;
    }

    public function setDureeTotale(?int $dureeTotale): static
    {
        $this->dureeTotale = $dureeTotale;

        return $this;
    }

    public function getCout(): ?float
    {
        return $this->cout;
    }

    public function setCout(?float $cout): static
    {
        $this->cout = $cout;

        return $this;
    }

    public function getDateCreation(): ?DateTimeInterface
    {
        return $this->dateCreation;
    }

    public function setDateCreation(?DateTimeInterface $dateCreation): static
    {
        $this->dateCreation = $dateCreation;

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

    public function getDateCloture(): ?DateTimeInterface
    {
        return $this->dateCloture;
    }

    public function setDateCloture(?DateTimeInterface $dateCloture): static
    {
        $this->dateCloture = $dateCloture;

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

    /**
     * @return Collection<int, ActionTache>
     */
    public function getTaches(): Collection
    {
        return $this->taches;
    }

    public function addTach(ActionTache $tach): static
    {
        if (!$this->taches->contains($tach)) {
            $this->taches->add($tach);
            $tach->setAction($this);
        }

        return $this;
    }

    public function removeTach(ActionTache $tach): static
    {
        if ($this->taches->removeElement($tach)) {
            // set the owning side to null (unless already changed)
            if ($tach->getAction() === $this) {
                $tach->setAction(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ActionUtilisateur>
     */
    public function getUtilisateurs(): Collection
    {
        return $this->utilisateurs;
    }

    public function addUtilisateur(ActionUtilisateur $utilisateur): static
    {
        if (!$this->utilisateurs->contains($utilisateur)) {
            $this->utilisateurs->add($utilisateur);
            $utilisateur->setAction($this);
        }

        return $this;
    }

    public function removeUtilisateur(ActionUtilisateur $utilisateur): static
    {
        if ($this->utilisateurs->removeElement($utilisateur)) {
            // set the owning side to null (unless already changed)
            if ($utilisateur->getAction() === $this) {
                $utilisateur->setAction(null);
            }
        }

        return $this;
    }

    public function getCause(): ?Cause
    {
        return $this->cause;
    }

    public function setCause(?Cause $cause): static
    {
        $this->cause = $cause;

        return $this;
    }

    public function getCriticite(): ?Criticite
    {
        return $this->criticite;
    }

    public function setCriticite(?Criticite $criticite): static
    {
        $this->criticite = $criticite;

        return $this;
    }

    public function getRemediation(): ?Remediation
    {
        return $this->remediation;
    }

    public function setRemediation(?Remediation $remediation): static
    {
        $this->remediation = $remediation;

        return $this;
    }
}
