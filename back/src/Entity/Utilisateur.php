<?php

namespace App\Entity;

use App\Repository\UtilisateurRepository;
use DateTimeInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use League\OAuth2\Server\Entities\UserEntityInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: UtilisateurRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_USERNAME', fields: [
    'username'
])]
class Utilisateur implements UserInterface, PasswordAuthenticatedUserInterface, UserEntityInterface
{

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['EquipeMembre', 'UtilisateurInfo', 'UtilisateurAll'])]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    #[Groups(['UtilisateurInfo', 'UtilisateurAll'])]
    private ?string $username = null;

    /**
     *
     * @var list<string> The user roles
     */
    #[ORM\Column]
    #[Groups(['UtilisateurInfo'])]
    private array $roles = [];

    /**
     *
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    /**
     *
     * @var string Old GMAO plain text password
     */
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $oldPassword = null;


    #[ORM\Column(length: 100)]
    #[Groups(['EquipeMembre', 'UtilisateurInfo', 'UtilisateurAll'])]
    private ?string $prenom = null;

    #[ORM\Column(length: 100)]
    #[Groups(['EquipeMembre', 'UtilisateurInfo', 'UtilisateurAll'])]
    private ?string $nom = null;

    #[ORM\Column]
    #[Groups(['UtilisateurAll', 'access'])]
    private ?bool $acces_gmao = null;

    #[ORM\Column]
    #[Groups(['UtilisateurAll', 'access'])]
    private ?bool $acces_data = null;

    #[ORM\Column]
    #[Groups(['UtilisateurAll', 'access'])]
    private ?bool $acces_spa = null;

    #[ORM\Column]
    #[Groups(['UtilisateurAll', 'access'])]
    private ?bool $acces_sandre = null;

    #[ORM\Column(length: 16)]
    #[Groups(['UtilisateurAll'])]
    private ?string $tel1 = null;

    #[ORM\Column(length: 16, nullable: true)]
    #[Groups(['UtilisateurAll'])]
    private ?string $tel2 = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['UtilisateurInfo', 'UtilisateurAll'])]
    private ?string $email = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?DateTimeInterface $date_desactivation = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?DateTimeInterface $date_creation = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?DateTimeInterface $date_derniere_conn = null;

    /**
     *
     * @var Collection<int, ActionUtilisateur>
     */
    #[ORM\OneToMany(targetEntity: ActionUtilisateur::class, mappedBy: 'utilisateur')]
    private Collection $actions;

    /**
     *
     * @var Collection<int, SecteurUtilisateur>
     */
    #[ORM\OneToMany(targetEntity: SecteurUtilisateur::class, mappedBy: 'utilisateur')]
    private Collection $secteurs;

    /**
     * @var Collection<int, SocieteUtilisateur>
     */
    #[ORM\OneToMany(targetEntity: SocieteUtilisateur::class, mappedBy: 'utilisateur', orphanRemoval: true)]
    private Collection $societeUtilisateurs;

    #[ORM\ManyToOne(inversedBy: 'utilisateurs')]
    #[ORM\JoinColumn(nullable: true)]
    private ?Societe $societePrincipal = null;

    /**
     * @var Collection<int, Fonction>
     */
    #[ORM\ManyToMany(targetEntity: Fonction::class, mappedBy: 'utilisateurs')]
    private Collection $fonctions;

    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'employe')]
    private ?self $responsable = null;

    /**
     * @var Collection<int, self>
     */
    #[ORM\OneToMany(targetEntity: self::class, mappedBy: 'responsable')]
    private Collection $employe;

    /**
     * @var Collection<int, EquipeUtilisateur>
     */
    #[ORM\OneToMany(targetEntity: EquipeUtilisateur::class, mappedBy: 'utilisateur', orphanRemoval: true)]
    #[Groups(['UtilisateurAll'])]
    private Collection $equipeUtilisateurs;

    public function __construct()
    {
        $this->actions = new ArrayCollection();
        $this->secteurs = new ArrayCollection();
        $this->societeUtilisateurs = new ArrayCollection();
        $this->fonctions = new ArrayCollection();
        $this->employe = new ArrayCollection();
        $this->equipeUtilisateurs = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    /**
     *
     * {@inheritdoc}
     * @return list<string>
     * @see UserInterface::getRoles
     *
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     *
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * Les anciens mots de passe en clair doivent rester intouchés pour le moment.
     * Les nouveaux mots de passe seront déplacés dans le champ password à terme.
     *
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    /**
     *
     * @param string $password
     *            Hashed password
     * @return static
     */
    public function setPassword(string $password): static
    {
        $this->password = $password;
        return $this;
    }

    public function getOldPassword(): ?string
    {
        return $this->oldPassword;
    }

    /**
     * Should not be used
     *
     * @param string $oldPassword
     * @return static
     */
    public function setOldPassword(?string $oldPassword): static
    {
        // $this->oldPassword = $oldPassword;
        return $this;
    }

    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    public function setPrenom(string $prenom): static
    {
        $this->prenom = $prenom;

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


    public function isAccesGmao(): ?bool
    {
        return $this->acces_gmao;
    }

    public function setAccesGmao(bool $acces_gmao): static
    {
        $this->acces_gmao = $acces_gmao;

        return $this;
    }

    public function isAccesData(): ?bool
    {
        return $this->acces_data;
    }

    public function setAccesData(bool $acces_data): static
    {
        $this->acces_data = $acces_data;

        return $this;
    }

    public function isAccesSpa(): ?bool
    {
        return $this->acces_spa;
    }

    public function setAccesSpa(bool $acces_spa): static
    {
        $this->acces_spa = $acces_spa;

        return $this;
    }

    public function isAccesSandre(): ?bool
    {
        return $this->acces_sandre;
    }

    public function setAccesSandre(bool $acces_sandre): static
    {
        $this->acces_sandre = $acces_sandre;

        return $this;
    }

    public function getTel1(): ?string
    {
        return $this->tel1;
    }

    public function setTel1(string $tel1): static
    {
        $this->tel1 = $tel1;

        return $this;
    }

    public function getTel2(): ?string
    {
        return $this->tel2;
    }

    public function setTel2(?string $tel2): static
    {
        $this->tel2 = $tel2;

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

    public function getDateDesactivation(): ?DateTimeInterface
    {
        return $this->date_desactivation;
    }

    public function setDateDesactivation(?DateTimeInterface $date_desactivation): static
    {
        $this->date_desactivation = $date_desactivation;

        return $this;
    }

    public function getDateCreation(): ?DateTimeInterface
    {
        return $this->date_creation;
    }

    public function setDateCreation(?DateTimeInterface $date_creation): static
    {
        $this->date_creation = $date_creation;

        return $this;
    }

    public function getDateDerniereConn(): ?DateTimeInterface
    {
        return $this->date_derniere_conn;
    }

    public function setDateDerniereConn(?DateTimeInterface $date_derniere_conn): static
    {
        $this->date_derniere_conn = $date_derniere_conn;

        return $this;
    }

    /**
     *
     * @return Collection<int, ActionUtilisateur>
     */
    public function getActions(): Collection
    {
        return $this->actions;
    }

    public function addAction(ActionUtilisateur $action): static
    {
        if (!$this->actions->contains($action)) {
            $this->actions->add($action);
            $action->setUtilisateur($this);
        }

        return $this;
    }

    public function removeAction(ActionUtilisateur $action): static
    {
        if ($this->actions->removeElement($action)) {
            // set the owning side to null (unless already changed)
            if ($action->getUtilisateur() === $this) {
                $action->setUtilisateur(null);
            }
        }

        return $this;
    }

    /**
     *
     * @return Collection<int, SecteurUtilisateur>
     */
    public function getSecteurs(): Collection
    {
        return $this->secteurs;
    }

    public function addSecteur(SecteurUtilisateur $secteur): static
    {
        if (!$this->secteurs->contains($secteur)) {
            $this->secteurs->add($secteur);
            $secteur->setUtilisateur($this);
        }

        return $this;
    }

    public function removeSecteur(SecteurUtilisateur $secteur): static
    {
        if ($this->secteurs->removeElement($secteur)) {
            // set the owning side to null (unless already changed)
            if ($secteur->getUtilisateur() === $this) {
                $secteur->setUtilisateur(null);
            }
        }

        return $this;
    }

    /**
     *
     * {@inheritdoc}
     * @see UserInterface::eraseCredentials
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    /**
     *
     * {@inheritdoc}
     * @see UserEntityInterface::getIdentifier
     */
    public function getIdentifier(): string
    {
        return $this->getUserIdentifier();
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string)$this->username;
    }

    public function addSocieteUtilisateur(SocieteUtilisateur $societeUtilisateur): static
    {
        if (!$this->societeUtilisateurs->contains($societeUtilisateur)) {
            $this->societeUtilisateurs->add($societeUtilisateur);
            $societeUtilisateur->setUtilisateur($this);
        }

        return $this;
    }

    public function removeSocieteUtilisateur(SocieteUtilisateur $societeUtilisateur): static
    {
        if ($this->societeUtilisateurs->removeElement($societeUtilisateur)) {
            // set the owning side to null (unless already changed)
            if ($societeUtilisateur->getUtilisateur() === $this) {
                $societeUtilisateur->setUtilisateur(null);
            }
        }

        return $this;
    }

    public function getSocietes(): array
    {

        $societeUtilisateurs = $this->getSocieteUtilisateurs();

        $societe = [];
        foreach ($societeUtilisateurs as $societeUtilisateur) {
            $societe[] = $societeUtilisateur->getSociete();
        }
        return $societe;
    }

    /**
     * @return Collection<int, SocieteUtilisateur>
     */
    public function getSocieteUtilisateurs(): Collection
    {
        return $this->societeUtilisateurs;
    }

    public function getSocietePrincipal(): ?Societe
    {
        return $this->societePrincipal;
    }

    public function setSocietePrincipal(?Societe $societePrincipal): static
    {
        $this->societePrincipal = $societePrincipal;

        return $this;
    }

    /**
     * @return Collection<int, Fonction>
     */
    public function getFonctions(): Collection
    {
        return $this->fonctions;
    }

    public function addFonction(Fonction $fonction): static
    {
        if (!$this->fonctions->contains($fonction)) {
            $this->fonctions->add($fonction);
            $fonction->addUtilisateur($this);
        }

        return $this;
    }

    public function removeFonction(Fonction $fonction): static
    {
        if ($this->fonctions->removeElement($fonction)) {
            $fonction->removeUtilisateur($this);
        }

        return $this;
    }

    public function getResponsable(): ?self
    {
        return $this->responsable;
    }

    public function setResponsable(?self $responsable): static
    {
        $this->responsable = $responsable;

        return $this;
    }

    /**
     * @return Collection<int, self>
     */
    public function getEmploye(): Collection
    {
        return $this->employe;
    }

    public function addEmploye(self $employe): static
    {
        if (!$this->employe->contains($employe)) {
            $this->employe->add($employe);
            $employe->setResponsable($this);
        }

        return $this;
    }

    public function removeEmploye(self $employe): static
    {
        if ($this->employe->removeElement($employe)) {
            // set the owning side to null (unless already changed)
            if ($employe->getResponsable() === $this) {
                $employe->setResponsable(null);
            }
        }

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
            $equipeUtilisateur->setUtilisateur($this);
        }

        return $this;
    }

    public function removeEquipeUtilisateur(EquipeUtilisateur $equipeUtilisateur): static
    {
        if ($this->equipeUtilisateurs->removeElement($equipeUtilisateur)) {
            // set the owning side to null (unless already changed)
            if ($equipeUtilisateur->getUtilisateur() === $this) {
                $equipeUtilisateur->setUtilisateur(null);
            }
        }

        return $this;
    }
}
