<?php

namespace App\Entity;

use App\Library\Enum\EnumNatureBien;
use App\Repository\TypeBienRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: TypeBienRepository::class)]
class TypeBien
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['defaultBien', 'default', 'defaultCaracteristique', 'minimal', 'defaultTypeBien', 'defaultCaracteristiqueTypeBien'])]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['default', 'defaultCaracteristique', 'defaultTypeBien', 'defaultCaracteristiqueTypeBien'])]
    private ?Societe $societe = null;

    #[ORM\Column(enumType: EnumNatureBien::class)]
    #[Groups(['defaultBien', 'default', 'defaultCaracteristique', 'minimal', 'defaultTypeBien'])]
    private ?EnumNatureBien $nature = null;

    #[ORM\Column(length: 255)]
    #[Groups(['defaultBien', 'default', 'defaultCaracteristique', 'minimal', 'defaultTypeBien', 'defaultCaracteristiqueTypeBien'])]
    private ?string $nom = null;

    /**
     * @var Collection<int, Bien>
     */
    #[ORM\OneToMany(targetEntity: Bien::class, mappedBy: 'typeBien')]
    private Collection $biens;

    // #[ORM\OneToOne(inversedBy: 'typeBien', cascade: ['persist', 'remove'])]
    // private ?ArboSiteType $arbo = null;

    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups(['default', 'defaultCaracteristique', 'defaultTypeBien'])]
    private ?array $arbo = null;

    /**
     * @var Collection<int, CaracteristiqueTypeBien>
     */
    #[ORM\OneToMany(targetEntity: CaracteristiqueTypeBien::class, mappedBy: 'typeBien', orphanRemoval: true)]
    #[Groups(['default', 'defaultCaracteristique', 'defaultTypeBien'])]
    private Collection $caracteristiqueTypeBiens;

    /**
     * @var Collection<int, LocPointMesureTypeBien>
     */
    #[ORM\OneToMany(targetEntity: LocPointMesureTypeBien::class, mappedBy: 'typeBien', orphanRemoval: true)]
    private Collection $locPointMesureTypeBiens;

    public function __construct()
    {
        $this->biens = new ArrayCollection();
        $this->caracteristiqueTypeBiens = new ArrayCollection();
        $this->locPointMesureTypeBiens = new ArrayCollection();
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

    public function getNature(): ?EnumNatureBien
    {
        return $this->nature;
    }

    public function setNature(EnumNatureBien $type): static
    {
        $this->nature = $type;

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

    /**
     * @return Collection<int, Bien>
     */
    public function getBiens(): Collection
    {
        return $this->biens;
    }

    public function addBien(Bien $bien): static
    {
        if (!$this->biens->contains($bien)) {
            $this->biens->add($bien);
            $bien->setTypeBien($this);
        }

        return $this;
    }

    public function removeBien(Bien $bien): static
    {
        if ($this->biens->removeElement($bien)) {
            // set the owning side to null (unless already changed)
            if ($bien->getTypeBien() === $this) {
                $bien->setTypeBien(null);
            }
        }

        return $this;
    }

    public function getArbo(): array
    {
        return $this->arbo;
    }

    public function setArbo(?array $arbo): static
    {
        $this->arbo = $arbo;

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
            $caracteristiqueTypeBien->setTypeBien($this);
        }

        return $this;
    }

    public function removeCaracteristiqueTypeBien(CaracteristiqueTypeBien $caracteristiqueTypeBien): static
    {
        if ($this->caracteristiqueTypeBiens->removeElement($caracteristiqueTypeBien)) {
            // set the owning side to null (unless already changed)
            if ($caracteristiqueTypeBien->getTypeBien() === $this) {
                $caracteristiqueTypeBien->setTypeBien(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, LocPointMesureTypeBien>
     */
    public function getLocPointMesureTypeBiens(): Collection
    {
        return $this->locPointMesureTypeBiens;
    }

    public function addLocPointMesureTypeBien(LocPointMesureTypeBien $locPointMesureTypeBien): static
    {
        if (!$this->locPointMesureTypeBiens->contains($locPointMesureTypeBien)) {
            $this->locPointMesureTypeBiens->add($locPointMesureTypeBien);
            $locPointMesureTypeBien->setTypeBien($this);
        }

        return $this;
    }

    public function removeLocPointMesureTypeBien(LocPointMesureTypeBien $locPointMesureTypeBien): static
    {
        if ($this->locPointMesureTypeBiens->removeElement($locPointMesureTypeBien)) {
            // set the owning side to null (unless already changed)
            if ($locPointMesureTypeBien->getTypeBien() === $this) {
                $locPointMesureTypeBien->setTypeBien(null);
            }
        }

        return $this;
    }
}
