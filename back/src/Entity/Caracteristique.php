<?php

namespace App\Entity;

use App\Library\Enum\EnumTypeChamp;
use App\Repository\CaracteristiqueRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: CaracteristiqueRepository::class)]
class Caracteristique
{

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['defaultCaracteristique', 'minimalCaracteristique', 'bienCarac', 'defaultCaracteristiqueTypeBien'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'caracteristiques')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Societe $societe = null;

    #[ORM\Column(length: 255)]
    #[Groups(['defaultCaracteristique', 'minimalCaracteristique', 'bienCarac', 'defaultCaracteristiqueTypeBien'])]
    private ?string $nom = null;

    #[ORM\Column(length: 1024, nullable: true)]
    #[Groups(['defaultCaracteristique', 'minimalCaracteristique'])]
    private ?string $valeurDefaut = null;

    #[ORM\Column(nullable: true)]
    private ?bool $obligatoire = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['defaultCaracteristique', 'minimalCaracteristique', 'bienCarac'])]
    private ?array $listeValeurs = null;

    #[ORM\Column(enumType: EnumTypeChamp::class)]
    #[Groups(['defaultCaracteristique', 'minimalCaracteristique', 'bienCarac'])]
    private ?EnumTypeChamp $typeChamp = null;

    #[ORM\ManyToOne]
    #[Groups(['defaultCaracteristique', 'minimalCaracteristique', 'bienCarac', 'defaultCaracteristiqueTypeBien'])]
    private ?Unite $unite = null;

    /**
     * @var Collection<int, CaracteristiqueTypeBien>
     */
    #[ORM\OneToMany(targetEntity: CaracteristiqueTypeBien::class, mappedBy: 'caracteristique', orphanRemoval: true)]
    private Collection $caracteristiqueTypeBiens;

    /**
     * @var Collection<int, BienCaracteristique>
     */
    #[ORM\OneToMany(targetEntity: BienCaracteristique::class, mappedBy: 'caracteristique')]
    private Collection $bienCaracteristiques;

    public function __construct()
    {
        $this->caracteristiqueTypeBiens = new ArrayCollection();
        $this->bienCaracteristiques = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

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

    public function isObligatoire(): ?bool
    {
        return $this->obligatoire;
    }

    public function setObligatoire(?bool $obligatoire): static
    {
        $this->obligatoire = $obligatoire;

        return $this;
    }

    public function getListeValeurs(): ?array
    {
        return $this->listeValeurs;
    }

    public function setListeValeurs(?array $listeValeurs): static
    {
        $this->listeValeurs = $listeValeurs;

        return $this;
    }

    public function getTypeChamp(): ?EnumTypeChamp
    {
        return $this->typeChamp;
    }

    public function setTypeChamp(EnumTypeChamp $typeChamp): static
    {
        $this->typeChamp = $typeChamp;

        return $this;
    }

    public function getUnite(): ?Unite
    {
        return $this->unite;
    }

    public function setUnite(?Unite $unite): static
    {
        $this->unite = $unite;

        return $this;
    }

    /**
     * @return Collection<int, CaracteristiqueTypeBien>
     */
    public function getCaracteristiqueTypeBiens(): Collection
    {
        return $this->caracteristiqueTypeBiens;
    }

    public function addCaracteristiqueTypeBien(CaracteristiqueTypeBien $caracteristiqueTypeBien): static
    {
        if (!$this->caracteristiqueTypeBiens->contains($caracteristiqueTypeBien)) {
            $this->caracteristiqueTypeBiens->add($caracteristiqueTypeBien);
            $caracteristiqueTypeBien->setCaracteristique($this);
        }

        return $this;
    }

    public function removeCaracteristiqueTypeBien(CaracteristiqueTypeBien $caracteristiqueTypeBien): static
    {
        if ($this->caracteristiqueTypeBiens->removeElement($caracteristiqueTypeBien)) {
            // set the owning side to null (unless already changed)
            if ($caracteristiqueTypeBien->getCaracteristique() === $this) {
                $caracteristiqueTypeBien->setCaracteristique(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, BienCaracteristique>
     */
    public function getBienCaracteristiques(): Collection
    {
        return $this->bienCaracteristiques;
    }

    public function addBienCaracteristique(BienCaracteristique $bienCaracteristique): static
    {
        if (!$this->bienCaracteristiques->contains($bienCaracteristique)) {
            $this->bienCaracteristiques->add($bienCaracteristique);
            $bienCaracteristique->setCaracteristique($this);
        }

        return $this;
    }

    public function removeBienCaracteristique(BienCaracteristique $bienCaracteristique): static
    {
        if ($this->bienCaracteristiques->removeElement($bienCaracteristique)) {
            // set the owning side to null (unless already changed)
            if ($bienCaracteristique->getCaracteristique() === $this) {
                $bienCaracteristique->setCaracteristique(null);
            }
        }

        return $this;
    }
}
