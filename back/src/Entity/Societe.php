<?php

namespace App\Entity;

use App\Repository\SocieteRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: SocieteRepository::class)]
class Societe
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['defaultCause', 'defaultCriticite', 'defaultRemediation', 'defaultTypeAction', 'defaultTypeReleve'])]
    private ?int $id = null;

    #[ORM\Column(length: 250)]
    #[Groups(['defaultCause', 'defaultCriticite', 'defaultRemediation', 'defaultTypeAction', 'defaultTypeReleve'])]
    private ?string $nom = null;

    #[ORM\Column(length: 250, nullable: true)]
    private ?string $logo = null;

    #[ORM\Column(length: 250, nullable: true)]
    private ?string $adresse_1 = null;

    #[ORM\Column(length: 250, nullable: true)]
    private ?string $adresse_2 = null;

    #[ORM\Column(length: 25, nullable: true)]
    private ?string $tel_1 = null;

    #[ORM\Column(length: 25, nullable: true)]
    private ?string $tel_2 = null;

    #[ORM\Column(length: 250, nullable: true)]
    private ?string $email = null;


    /**
     * @var Collection<int, Site>
     */
    #[ORM\OneToMany(targetEntity: Site::class, mappedBy: 'societe')]
    private Collection $sites;

    /**
     * @var Collection<int, Secteur>
     */
    #[ORM\OneToMany(targetEntity: Secteur::class, mappedBy: 'societe')]
    private Collection $secteurs;

    /**
     * @var Collection<int, Caracteristique>
     */
    #[ORM\OneToMany(targetEntity: Caracteristique::class, mappedBy: 'societe')]
    private Collection $caracteristiques;

    /**
     * @var Collection<int, Etiquette>
     */
    #[ORM\OneToMany(targetEntity: Etiquette::class, mappedBy: 'societe')]
    private Collection $etiquettes;

    /**
     * @var Collection<int, Equipe>
     */
    #[ORM\OneToMany(targetEntity: Equipe::class, mappedBy: 'societe')]
    private Collection $equipes;

    /**
     * @var Collection<int, GroupeTache>
     */
    #[ORM\OneToMany(targetEntity: GroupeTache::class, mappedBy: 'societe')]
    private Collection $groupeTaches;

    /**
     * @var Collection<int, SocieteSansStatut>
     */
    #[ORM\OneToMany(targetEntity: SocieteSansStatut::class, mappedBy: 'societe')]
    private Collection $statutsExclus;

    /**
     * @var Collection<int, SocieteUtilisateur>
     */
    #[ORM\OneToMany(targetEntity: SocieteUtilisateur::class, mappedBy: 'societe', orphanRemoval: true)]
    private Collection $societeUtilisateurs;

    /**
     * @var Collection<int, Utilisateur>
     */
    #[ORM\OneToMany(targetEntity: Utilisateur::class, mappedBy: 'societe')]
    private Collection $utilisateurs;

    #[ORM\ManyToOne(inversedBy: 'societe')]
    private ?Ville $ville = null;

    /**
     * @var Collection<int, Document>
     */
    #[ORM\OneToMany(targetEntity: Document::class, mappedBy: 'societe')]
    private Collection $documents;

    #[ORM\Column]
    private ?int $nbrMaxUser = null;

    public function __construct()
    {
        $this->sites = new ArrayCollection();
        $this->secteurs = new ArrayCollection();
        $this->caracteristiques = new ArrayCollection();
        $this->etiquettes = new ArrayCollection();
        $this->equipes = new ArrayCollection();
        $this->groupeTaches = new ArrayCollection();
        $this->statutsExclus = new ArrayCollection();
        $this->societeUtilisateurs = new ArrayCollection();
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

    public function getLogo(): ?string
    {
        return $this->logo;
    }

    public function setLogo(?string $logo): static
    {
        $this->logo = $logo;

        return $this;
    }

    public function getAdresse1(): ?string
    {
        return $this->adresse_1;
    }

    public function setAdresse1(?string $adresse_1): static
    {
        $this->adresse_1 = $adresse_1;

        return $this;
    }

    public function getAdresse2(): ?string
    {
        return $this->adresse_2;
    }

    public function setAdresse2(?string $adresse_2): static
    {
        $this->adresse_2 = $adresse_2;

        return $this;
    }

    public function getTel1(): ?string
    {
        return $this->tel_1;
    }

    public function setTel1(?string $tel_1): static
    {
        $this->tel_1 = $tel_1;

        return $this;
    }

    public function getTel2(): ?string
    {
        return $this->tel_2;
    }

    public function setTel2(?string $tel_2): static
    {
        $this->tel_2 = $tel_2;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): static
    {
        $this->email = $email;

        return $this;
    }


    /**
     * @return Collection<int, Site>
     */
    public function getSites(): Collection
    {
        return $this->sites;
    }

    public function addSite(Site $site): static
    {
        if (!$this->sites->contains($site)) {
            $this->sites->add($site);
            $site->setSociete($this);
        }

        return $this;
    }

    public function removeSite(Site $site): static
    {
        if ($this->sites->removeElement($site)) {
            // set the owning side to null (unless already changed)
            if ($site->getSociete() === $this) {
                $site->setSociete(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Secteur>
     */
    public function getSecteurs(): Collection
    {
        return $this->secteurs;
    }

    public function addSecteur(Secteur $secteur): static
    {
        if (!$this->secteurs->contains($secteur)) {
            $this->secteurs->add($secteur);
            $secteur->setSociete($this);
        }

        return $this;
    }

    public function removeSecteur(Secteur $secteur): static
    {
        if ($this->secteurs->removeElement($secteur)) {
            // set the owning side to null (unless already changed)
            if ($secteur->getSociete() === $this) {
                $secteur->setSociete(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Caracteristique>
     */
    public function getCaracteristiques(): Collection
    {
        return $this->caracteristiques;
    }

    public function addCaracteristique(Caracteristique $caracteristique): static
    {
        if (!$this->caracteristiques->contains($caracteristique)) {
            $this->caracteristiques->add($caracteristique);
            $caracteristique->setSociete($this);
        }

        return $this;
    }

    public function removeCaracteristique(Caracteristique $caracteristique): static
    {
        if ($this->caracteristiques->removeElement($caracteristique)) {
            // set the owning side to null (unless already changed)
            if ($caracteristique->getSociete() === $this) {
                $caracteristique->setSociete(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Etiquette>
     */
    public function getEtiquettes(): Collection
    {
        return $this->etiquettes;
    }

    public function addEtiquette(Etiquette $etiquette): static
    {
        if (!$this->etiquettes->contains($etiquette)) {
            $this->etiquettes->add($etiquette);
            $etiquette->setSociete($this);
        }

        return $this;
    }

    public function removeEtiquette(Etiquette $etiquette): static
    {
        if ($this->etiquettes->removeElement($etiquette)) {
            // set the owning side to null (unless already changed)
            if ($etiquette->getSociete() === $this) {
                $etiquette->setSociete(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Equipe>
     */
    public function getEquipes(): Collection
    {
        return $this->equipes;
    }

    public function addEquipe(Equipe $equipe): static
    {
        if (!$this->equipes->contains($equipe)) {
            $this->equipes->add($equipe);
            $equipe->setSociete($this);
        }

        return $this;
    }

    public function removeEquipe(Equipe $equipe): static
    {
        if ($this->equipes->removeElement($equipe)) {
            // set the owning side to null (unless already changed)
            if ($equipe->getSociete() === $this) {
                $equipe->setSociete(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, GroupeTache>
     */
    public function getGroupeTaches(): Collection
    {
        return $this->groupeTaches;
    }

    public function addGroupeTach(GroupeTache $groupeTach): static
    {
        if (!$this->groupeTaches->contains($groupeTach)) {
            $this->groupeTaches->add($groupeTach);
            $groupeTach->setSociete($this);
        }

        return $this;
    }

    public function removeGroupeTach(GroupeTache $groupeTach): static
    {
        if ($this->groupeTaches->removeElement($groupeTach)) {
            // set the owning side to null (unless already changed)
            if ($groupeTach->getSociete() === $this) {
                $groupeTach->setSociete(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, SocieteSansStatut>
     */
    public function getStatutsExclus(): Collection
    {
        return $this->statutsExclus;
    }

    public function addStatutsExclu(SocieteSansStatut $statutsExclu): static
    {
        if (!$this->statutsExclus->contains($statutsExclu)) {
            $this->statutsExclus->add($statutsExclu);
            $statutsExclu->setSociete($this);
        }

        return $this;
    }

    public function removeStatutsExclu(SocieteSansStatut $statutsExclu): static
    {
        if ($this->statutsExclus->removeElement($statutsExclu)) {
            // set the owning side to null (unless already changed)
            if ($statutsExclu->getSociete() === $this) {
                $statutsExclu->setSociete(null);
            }
        }

        return $this;
    }

    public function addSocieteUtilisateur(SocieteUtilisateur $societeUtilisateur): static
    {
        if (!$this->societeUtilisateurs->contains($societeUtilisateur)) {
            $this->societeUtilisateurs->add($societeUtilisateur);
            $societeUtilisateur->setSociete($this);
        }

        return $this;
    }

    public function removeSocieteUtilisateur(SocieteUtilisateur $societeUtilisateur): static
    {
        if ($this->societeUtilisateurs->removeElement($societeUtilisateur)) {
            // set the owning side to null (unless already changed)
            if ($societeUtilisateur->getSociete() === $this) {
                $societeUtilisateur->setSociete(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, SocieteUtilisateur>
     */
    public function getSocieteUtilisateurs(): Collection
    {
        return $this->societeUtilisateurs;
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
            $utilisateur->setSocietePrincipal($this);
        }

        return $this;
    }

    public function removeUtilisateur(Utilisateur $utilisateur): static
    {
        if ($this->utilisateurs->removeElement($utilisateur)) {
            // set the owning side to null (unless already changed)
            if ($utilisateur->getSocietePrincipal() === $this) {
                $utilisateur->setSocietePrincipal(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Document>
     */
    public function getDocuments(): Collection
    {
        return $this->documents;
    }

    public function addDocument(Document $document): static
    {
        if (!$this->documents->contains($document)) {
            $this->documents->add($document);
            $document->setSociete($this);
        }

        return $this;
    }

    public function removeDocument(Document $document): static
    {
        if ($this->documents->removeElement($document)) {
            // set the owning side to null (unless already changed)
            if ($document->getSociete() === $this) {
                $document->setSociete(null);
            }
        }

        return $this;
    }

    public function getVille(): ?Ville
    {
        return $this->ville;
    }

    public function setVille(?Ville $ville): static
    {
        $this->ville = $ville;

        return $this;
    }

    public function getNbrMaxUser(): ?int
    {
        return $this->nbrMaxUser;
    }

    public function setNbrMaxUser(int $nbrMaxUser): static
    {
        $this->nbrMaxUser = $nbrMaxUser;

        return $this;
    }
}
