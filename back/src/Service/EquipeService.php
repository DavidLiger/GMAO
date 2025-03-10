<?php

namespace App\Service;


use App\Dto\EquipeDto;
use App\Entity\Equipe;
use App\Entity\EquipeUtilisateur;
use App\Entity\Societe;
use App\Entity\Utilisateur;
use App\Repository\EquipeRepository;
use App\Repository\EquipeUtilisateurRepository;
use App\Repository\UtilisateurRepository;

class EquipeService
{
    public function __construct(
        private EquipeRepository            $equipeRepository,
        private UtilisateurRepository       $utilisateurRepository,
        private EquipeUtilisateurRepository $equipeUtilisateurRepository)
    {
    }

    public function createEquipeDTOTransformer(EquipeDto $dto, Societe $societe): Equipe
    {
        $equipe = new Equipe();

        $equipe->setNom($dto->nom);
        $equipe->setLibelle($dto->label);
        $equipe->setColor($dto->color);
        $equipe->setSociete($societe);

        $equipe = $this->equipeRepository->create($equipe);

        foreach ($dto->membres as $member) {
            $newMember = new EquipeUtilisateur();
            $user = $this->utilisateurRepository->findOneBy(['id' => $member]);
            $newMember->setEquipe($equipe);
            $newMember->setUtilisateur($user);
            $newMember->setResponsable($dto->responsable === $user->getId());
            $this->equipeUtilisateurRepository->create($newMember);

        }

        return $equipe;
    }

    public function addMember(Utilisateur $user, Equipe $equipe)
    {
        $newMember = new EquipeUtilisateur();

        $newMember->setEquipe($equipe);
        $newMember->setUtilisateur($user);
        $newMember->setResponsable(false);
        $this->equipeUtilisateurRepository->create($newMember);
    }

    public function formatEquipe(Equipe $equipe): array
    {
        $equipeUtilisateurs = $equipe->getEquipeUtilisateurs();
        $membres = [];

        foreach ($equipeUtilisateurs as $equipeUtilisateur) {
            $user = $equipeUtilisateur->getUtilisateur();
            $userData = [
                'id' => $user->getId(),
                'prenom' => $user->getPrenom(),
                'nom' => $user->getNom(),
                'responsable' => $equipeUtilisateur->isResponsable()
            ];
            $membres[] = $userData;
        }

        return [
            'id' => $equipe->getId(),
            'nom' => $equipe->getNom(),
            'label' => $equipe->getLibelle(),
            'color' => $equipe->getColor(),
            'equipeUtilisateurs' => $membres
        ];
    }

    public function updateEquipeDTOTransformer(EquipeDto $dto, Equipe $equipe): Equipe
    {
        $equipe->setNom($dto->nom);
        $equipe->setLibelle($dto->label);
        $equipe->setColor($dto->color);

        $this->equipeRepository->update();

        foreach ($dto->membres as $membre) {
            $user = $this->utilisateurRepository->findOneBy(['id' => $membre]);
            $equipeMembre = $this->equipeUtilisateurRepository->findOneBy(["equipe" => $equipe, "utilisateur" => $user]);
            if ($equipeMembre === null) {
                $newMember = new EquipeUtilisateur();
                $newMember->setEquipe($equipe);
                $newMember->setUtilisateur($user);
                $newMember->setResponsable($dto->responsable === $user->getId());
                $this->equipeUtilisateurRepository->create($newMember);
            } else {
                $equipeMembre->setResponsable($dto->responsable === $user->getId());
                $this->equipeUtilisateurRepository->update();
            }

        }

        return $equipe;
    }
}