<?php

namespace App\Command;

use App\Entity\Utilisateur;
use App\Repository\SocieteRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(name: 'create-user', description: 'create your first user')]
class CreateUser extends Command
{
    public function __construct(
        private SocieteRepository           $societeRepository,
        private UserPasswordHasherInterface $passwordHasher,
        private EntityManagerInterface      $entityManager,
    )
    {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addArgument('arg1', InputArgument::OPTIONAL, 'Argument description')->addOption('option1', null, InputOption::VALUE_NONE, 'Option description');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $IO = new SymfonyStyle($input, $output);

        $utilisateur = new Utilisateur();
        $utilisateur->setUsername('dupont2');
        $newPassword = $this->passwordHasher->hashPassword($utilisateur, 'biotrade');
        $utilisateur->setPassword($newPassword);
        $utilisateur->setPrenom('pierreEtienne');
        $utilisateur->setNom("Mouhot");
        $utilisateur->setEmail("mouhot@biotrade.fr");
        $utilisateur->setTel1("0605040302");
        $utilisateur->setTel2("");
        $utilisateur->setAccesGmao(true);
        $utilisateur->setAccesData(true);
        $utilisateur->setAccesSpa(true);
        $utilisateur->setAccesSandre(true);
        $utilisateur->setResponsable(null);
        $utilisateur->setSocietePrincipal($this->societeRepository->findOneBy(["id" => 1]));

        $this->entityManager->persist($utilisateur);
        $this->entityManager->flush();
        $IO->success('OK');
        return Command::SUCCESS;
    }
}
