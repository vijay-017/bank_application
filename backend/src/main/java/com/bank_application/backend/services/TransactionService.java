package com.bank_application.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bank_application.backend.entity.*;
import com.bank_application.backend.repository.BankAccountRepo;
import com.bank_application.backend.repository.TransactionRepo;

@Service
public class TransactionService {

    @Autowired
    private BankAccountRepo bankAccountRepo;

    @Autowired
    private TransactionRepo transactionRepo;

    @Transactional
    public com.bank_application.backend.controller.TransferResponse processTransfer(com.bank_application.backend.controller.TransferRequest request) {
        if (request.getAmount() <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }

        // Get Sender Account (with lock to prevent double spending)
        BankAccount sender = bankAccountRepo.findByIdForUpdate(request.getFromAccountId())
                .orElseThrow(() -> new RuntimeException("Sender account not found"));

        BankAccount receiver = null;

        if ("MOBILE".equals(request.getType())) {
            receiver = bankAccountRepo.findByMobileNumberAndPrimaryAccountTrueForUpdate(request.getToMobileNumber())
                    .orElseGet(() -> {
                        List<BankAccount> accounts = bankAccountRepo.findByMobileNumber(request.getToMobileNumber());
                        if (accounts.isEmpty()) {
                            throw new RuntimeException("Recipient mobile number has no linked bank accounts");
                        }
                        // Lock the fallback account before using it
                        return bankAccountRepo.findByIdForUpdate(accounts.get(0).getId())
                                .orElseThrow(() -> new RuntimeException("Recipient account not found"));
                    });
        } else if ("ACCOUNT".equals(request.getType())) {
            receiver = bankAccountRepo.findByAccountNumberForUpdate(request.getToAccountNumber())
                    .orElseThrow(() -> new RuntimeException("Recipient not found"));
        } else if ("SELF".equals(request.getType())) {
            receiver = bankAccountRepo.findByIdForUpdate(request.getToAccountId())
                    .orElseThrow(() -> new RuntimeException("Recipient not found"));
        } else {
            throw new IllegalArgumentException("Invalid transfer type");
        }

        if (sender.getId().equals(receiver.getId())) {
            throw new IllegalArgumentException("Cannot transfer to same account");
        }

        if (sender.getBalance() < request.getAmount()) {
            throw new RuntimeException("Insufficient balance");
        }

        // Deduct
        sender.setBalance(sender.getBalance() - request.getAmount());

        // Credit
        receiver.setBalance(receiver.getBalance() + request.getAmount());

        bankAccountRepo.save(sender);
        bankAccountRepo.save(receiver);

        // Transaction records
        // 1. Sender (DEBIT)
        Transaction debitTx = new Transaction();
        debitTx.setFromNumber(sender.getMobileNumber());
        debitTx.setToNumber(receiver.getMobileNumber());
        debitTx.setFromAccountId(sender.getId());
        debitTx.setToAccountId(receiver.getId());
        debitTx.setAmount(request.getAmount());
        debitTx.setType(TransactionType.DEBIT);
        debitTx.setCategory(request.getCategory() != null ? request.getCategory() : "Transfer");
        debitTx.setStatus(TransactionStatus.SUCCESS);
        
        if ("SELF".equals(request.getType())) {
            debitTx.setDescription("Self Transfer Debit");
        } else {
            debitTx.setDescription("Money Transfer sent");
        }
        
        debitTx = transactionRepo.save(debitTx);

        // 2. Receiver (CREDIT)
        Transaction creditTx = new Transaction();
        creditTx.setFromNumber(sender.getMobileNumber());
        creditTx.setToNumber(receiver.getMobileNumber());
        creditTx.setFromAccountId(sender.getId());
        creditTx.setToAccountId(receiver.getId());
        creditTx.setAmount(request.getAmount());
        creditTx.setType(TransactionType.CREDIT);
        creditTx.setCategory(request.getCategory() != null ? request.getCategory() : "Transfer");
        creditTx.setStatus(TransactionStatus.SUCCESS);

        if ("SELF".equals(request.getType())) {
            creditTx.setDescription("Self Transfer Credit");
        } else {
            creditTx.setDescription("Money Transfer received");
        }

        transactionRepo.save(creditTx);

        return new com.bank_application.backend.controller.TransferResponse("Transfer successful", debitTx.getId(), sender.getBalance());
    }



    @Transactional
    public Transaction transferMoneyUsingMobile(String fromMobile,
                                                String toMobile,
                                                double amount,
                                                String category) {

        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }

        if (fromMobile.equals(toMobile)) {
            throw new IllegalArgumentException("Cannot transfer to same mobile number");
        }

        //  Get sender accounts
        List<BankAccount> senderAccounts = bankAccountRepo.findByMobileNumber(fromMobile);

        if (senderAccounts.isEmpty()) {
            throw new RuntimeException("Sender not found");
        }

        //  Choose sender account (Primary or first account)
        BankAccount sender = senderAccounts.stream()
                .filter(BankAccount::isPrimaryAccount)
                .findFirst()
                .orElse(senderAccounts.get(0));

        //  Get receiver PRIMARY account
        BankAccount receiver = bankAccountRepo
                .findByMobileNumberAndPrimaryAccountTrue(toMobile)
                .orElseThrow(() -> new RuntimeException("Receiver primary account not found"));

        //  Balance check
        if (sender.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        //  Deduct
        sender.setBalance(sender.getBalance() - amount);

        //  Credit to primary account
        receiver.setBalance(receiver.getBalance() + amount);

        bankAccountRepo.save(sender);
        bankAccountRepo.save(receiver);

        //  Transaction record
        Transaction transaction = new Transaction();
        transaction.setFromNumber(sender.getMobileNumber());
        transaction.setToNumber(receiver.getMobileNumber());
        transaction.setAmount(amount);
        transaction.setType(TransactionType.DEBIT);
        transaction.setCategory(category);

        // 🧠 Description logic
        if (fromMobile.equals(toMobile)) {
            transaction.setDescription("Self Transfer");
        } else {
            transaction.setDescription("Money Transfer");
        }

        transaction.setStatus(TransactionStatus.SUCCESS);

        return transactionRepo.save(transaction);
    }
    
    
    //Find transactions based on mobileNUmber
    public List<Transaction> getTransactions(String mobileNumber){
    	return transactionRepo.findDoubleEntryTransactionsForUser(mobileNumber);
    }
    
    //Find all transactions
    public List<Transaction> getAllTransactions(){
    	return transactionRepo.findAll();
    }
	
}