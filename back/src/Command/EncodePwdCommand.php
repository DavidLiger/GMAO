<?php
namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use App\Repository\UtilisateurRepository;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Entity\Utilisateur;

#[AsCommand(name: 'encode-pwd', description: 'Add a short description for your command')]
class EncodePwdCommand extends Command
{

    private UtilisateurRepository $UtilisateurRepo;

    private UserPasswordHasherInterface $PasswordHasher;

    public function __construct(UtilisateurRepository $UserRepo, UserPasswordHasherInterface $PassworHasher)
    {
        parent::__construct();
        $this->UtilisateurRepo = $UserRepo;
        $this->PasswordHasher = $PassworHasher;
    }

    protected function configure(): void
    {
        $this->addArgument('arg1', InputArgument::OPTIONAL, 'Argument description')->addOption('option1', null, InputOption::VALUE_NONE, 'Option description');
    }

    /**
     *
     * @todo faire une boucle à partir d'un "findAll"
     * {@inheritdoc}
     * @see \Symfony\Component\Console\Command\Command::execute()
     */
    protected function execute(InputInterface $Input, OutputInterface $Output): int
    {
        $IO = new SymfonyStyle($Input, $Output);
        // $arg1 = $Input->getArgument('arg1');
        // if ($arg1) {
        // $IO->note(sprintf('You passed an argument: %s', $arg1));
        // }

        // if ($Input->getOption('option1')) {
        // // ...
        // }

        $users = $this->UtilisateurRepo->findAll();
        if (! empty($users)) {
            $IO->info(sprintf('%s users to encode password...', count($users)));
            foreach ($users as $ix => $user) {
                if (! $user instanceof Utilisateur)
                    continue;
                $username = (string) $user->getUsername();
                $plainTextPassword = (string) $user->getOldPassword();
                $IO->writeln(sprintf(' -%s: processing "%s" having plaint text password %s', ($ix + 1), $username, $plainTextPassword));
                if (! $plainTextPassword) {
                    $IO->error('Password is empty');
                    continue;
                }

                $newHashedPassword = $this->PasswordHasher->hashPassword($user, $plainTextPassword);
                $IO->info(sprintf('Hashed password (being recorded and replacing previous one): %s', $newHashedPassword));

                try {
                    $this->UtilisateurRepo->upgradePassword($user, $newHashedPassword);
                } catch (\Exception $Exc) {
                    $IO->error($Exc->getMessage() . "\n" . $Exc->getTraceAsString());
                    return Command::FAILURE;
                }

                $IO->success('OK');
            }
            return Command::SUCCESS;
        }
        $IO->error('No user found');
        return Command::FAILURE;
    }
}
