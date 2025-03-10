<?php

namespace App\Service;


use App\Dto\CreateUtilisateurDTO;
use App\Dto\UpdateUtilisateurDTO;
use App\Entity\EquipeUtilisateur;
use App\Entity\Utilisateur;
use App\Repository\EquipeRepository;
use App\Repository\EquipeUtilisateurRepository;
use App\Repository\UtilisateurRepository;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UtilisateurService
{
    public function __construct(
        private readonly UtilisateurRepository       $utilisateurRepository,
        private readonly UserPasswordHasherInterface $passwordHarsher,
        private readonly EquipeUtilisateurRepository $equipeUtilisateurRepository,
        private readonly EquipeRepository            $equipeRepository,
        private MailerInterface                      $mailer)
    {
    }

    public function createUtilisateurDTOTransformer(CreateUtilisateurDTO $dto, Utilisateur $responsable): Utilisateur
    {

        $utilisateur = new Utilisateur();
        $utilisateur->setUsername($dto->username);
        $newPassword = $this->passwordHarsher->hashPassword($utilisateur, 'default_password');
        $utilisateur->setPassword($newPassword);
        $utilisateur->setPrenom($dto->prenom);
        $utilisateur->setNom($dto->nom);
        $utilisateur->setEmail($dto->email);
        $utilisateur->setTel1($dto->tel1);
        $utilisateur->setTel2($dto->tel2);
        $utilisateur->setAccesGmao($dto->acces_gmao);
        $utilisateur->setAccesData($dto->acces_data);
        $utilisateur->setAccesSpa($dto->acces_spa);
        $utilisateur->setAccesSandre($dto->acces_sandre);
        $utilisateur->setResponsable($responsable);
        $utilisateur->setSocietePrincipal($responsable->getSocietePrincipal());
        $this->utilisateurRepository->create($utilisateur);

        $this->sendEmail($utilisateur->getEmail(), $utilisateur->getUsername(), 'default_password');
        return $utilisateur;
    }

    public function sendEmail(string $email, string $username, string $password): void
    {
        $loginUrl = $_ENV['APP_URL'] . 'login'; // Assurez-vous d'avoir une route "login_page"

        $emailMessage = (new Email())
            ->from('no-reply@votre-application.com') // Remplacez par votre adresse e-mail
            ->to($email)
            ->subject('Création de votre compte')
            ->html("
                <p>Bonjour,</p>
                <p>Votre compte a été créé avec succès. Voici vos informations de connexion :</p>
                <ul>
                    <li><strong>Nom d'utilisateur :</strong> $username</li>
                    <li><strong>Mot de passe :</strong> $password</li>
                </ul>
                <p>Vous pouvez vous connecter en utilisant le lien suivant :</p>
                <a href=\"$loginUrl\">Page de connexion</a>
                <p>Merci,</p>
                <p>L'équipe de Biotrade.</p>
            ");

        $this->mailer->send($emailMessage);
    }

    public function buildUserTree(Utilisateur $utilisateur): ?array
    {
        if ($utilisateur->getDateDesactivation() === null) {
            return [
                'id' => $utilisateur->getId(),
                'username' => $utilisateur->getUsername(),
                'nom' => $utilisateur->getNom(),
                'prenom' => $utilisateur->getPrenom(),
                'email' => $utilisateur->getEmail(),
                'tel1' => $utilisateur->getTel1(),
                'tel2' => $utilisateur->getTel2(),
                'employe' => array_map(
                    fn(Utilisateur $child) => $this->buildUserTree($child),
                    $utilisateur->getEmploye()->toArray()
                ),
            ];
        }
        return null;
    }

    public function updateUser(UpdateUtilisateurDTO $dto, Utilisateur $utilisateur)
    {
        $utilisateur->setPrenom($dto->prenom);
        $utilisateur->setNom($dto->nom);
        $utilisateur->setEmail($dto->email);
        $utilisateur->setTel1($dto->tel1);
        $utilisateur->setTel2($dto->tel2);
        $utilisateur->setUsername($dto->username);

        if ($dto->acces_gmao !== null) {
            $utilisateur->setAccesGmao($dto->acces_gmao);
        }
        if ($dto->acces_data !== null) {
            $utilisateur->setAccesData($dto->acces_data);
        }
        if ($dto->acces_spa !== null) {
            $utilisateur->setAccesSpa($dto->acces_spa);
        }
        if ($dto->acces_sandre !== null) {
            $utilisateur->setAccesSandre($dto->acces_sandre);
        }


        $this->utilisateurRepository->update();

        if ($dto->teams !== null) {

            // Récupération de la collection actuelle
            $currentTeams = $utilisateur->getEquipeUtilisateurs();

            // Suppression des équipes qui ne sont plus dans le DTO
            foreach ($currentTeams as $team) {
                if (!in_array($team->getUtilisateur()->getId(), $dto->teams, true)) {
                    $this->equipeUtilisateurRepository->delete($team);
                }
            }

            // Ajout des nouvelles équipes du DTO
            foreach ($dto->teams as $newTeamId) {
                $newTeam = $this->equipeRepository->findOneBy(['id' => $newTeamId]);
                if (!$currentTeams->contains($newTeam)) {
                    $equipeUtilisateur = new EquipeUtilisateur();
                    $equipeUtilisateur->setUtilisateur($utilisateur);
                    $equipeUtilisateur->setEquipe($newTeam);
                    $equipeUtilisateur->setResponsable(false);
                    $this->equipeUtilisateurRepository->create($equipeUtilisateur);
                }
            }
        }

        return $utilisateur;
    }

    public function collectEmployees(Utilisateur $user, array &$flatList): void
    {
        if ($user->getDateDesactivation() === null) {
            $flatList[] = [
                'id' => $user->getId(),
                'nom' => $user->getNom(),
                'prenom' => $user->getPrenom()
            ];
            // Appeler récursivement pour chaque employé
            foreach ($user->getEmploye() as $employee) {
                $this->collectEmployees($employee, $flatList);
            }
        }
        // Ajouter l'utilisateur à la liste plate
    }

    public function getUserHierarchy(Utilisateur $user): array
    {
        $flatList = [];
        $this->collectEmployees($user, $flatList);
        return $flatList;
    }

    public function delete(Utilisateur $user)
    {
        $equipes = $user->getEquipeUtilisateurs();
        foreach ($equipes as $equipe) {
            $this->equipeUtilisateurRepository->delete($equipe);
        }
    }
}